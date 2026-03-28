'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// --- Types ---

export interface DashboardMetrics {
  totalUsers: number
  activeUsersToday: number
  foodLogsToday: number
  workoutsToday: number
  aiChatsToday: number
  activePlans: number
  inactiveUsers: number
  calorieImbalance: number
  weightAlerts: number
}

export interface RecentUser {
  id: string
  name: string
  email: string
  goal: string
  created_at: string
}

export interface RecentWorkout {
  id: string
  title: string
  duration: number
  completed: boolean
  userName: string
}

export interface RecentChat {
  id: string
  message: string
  role: string
  created_at: string
  userName: string
}

export interface WeightLog {
  id: string
  user_id: string
  weight_kg: number
  bmi: number
  logged_at: string
  userName: string
}

export interface WorkoutPlan {
  id: string
  user_id: string
  plan_name: string
  goal_type: string
  days_per_week: number
  is_active: boolean
  userName: string
}

export interface DashboardData {
  metrics: DashboardMetrics
  recentUsers: RecentUser[]
  recentWorkouts: RecentWorkout[]
  recentChats: RecentChat[]
  weightLogs: WeightLog[]
  workoutPlans: WorkoutPlan[]
}

interface UseDashboardReturn {
  data: DashboardData | null
  loading: boolean
  error: string | null
}

// --- Helper: today's date range ---

function getTodayRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return { startISO: start.toISOString(), endISO: end.toISOString() }
}

function getThreeDaysAgoISO() {
  const d = new Date()
  d.setDate(d.getDate() - 3)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

// --- Hook ---

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const { startISO, endISO } = getTodayRange()
        const threeDaysAgoISO = getThreeDaysAgoISO()

        // Parallel batch 1: counts + recent data + all needed tables
        const [
          totalUsersRes,
          activeUsersTodayRes,
          foodLogsTodayRes,
          workoutsTodayRes,
          aiChatsTodayRes,
          activePlansRes,
          recentUsersRes,
          recentWorkoutsRes,
          recentChatsRes,
          allUsersRes,
          recentWorkoutUsersRes,
          summariesRes,
          weightLogsRes,
          activeWorkoutPlansRes,
        ] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact', head: true }),
          supabase.from('daily_summaries').select('id', { count: 'exact', head: true })
            .gte('summary_date', startISO).lt('summary_date', endISO),
          supabase.from('food_logs').select('id', { count: 'exact', head: true })
            .gte('logged_at', startISO).lt('logged_at', endISO),
          supabase.from('workouts').select('id', { count: 'exact', head: true })
            .eq('completed', true)
            .gte('created_at', startISO).lt('created_at', endISO),
          supabase.from('ai_chats').select('id', { count: 'exact', head: true })
            .gte('created_at', startISO).lt('created_at', endISO),
          supabase.from('workout_plans').select('id', { count: 'exact', head: true })
            .eq('is_active', true),
          supabase.from('users').select('id, name, email, goal, created_at')
            .order('created_at', { ascending: false }).limit(5),
          supabase.from('workouts').select('id, title, duration, completed, user_id')
            .order('created_at', { ascending: false }).limit(5),
          supabase.from('ai_chats').select('id, message, role, created_at, user_id')
            .order('created_at', { ascending: false }).limit(10),
          // For inactive users: all user IDs
          supabase.from('users').select('id'),
          // Users who worked out in last 3 days
          supabase.from('workouts').select('user_id')
            .gte('created_at', threeDaysAgoISO),
          // For calorie imbalance (FIXED: calories_in → calories_consumed)
          supabase.from('daily_summaries').select('calories_consumed, calories_out'),
          // Latest weight logs (5 most recent)
          supabase.from('weight_logs').select('id, user_id, weight_kg, bmi, logged_at')
            .order('logged_at', { ascending: false }).limit(5),
          // Active workout plans with user info
          supabase.from('workout_plans').select('id, user_id, plan_name, goal_type, days_per_week, is_active')
            .eq('is_active', true).limit(5),
        ])

        // --- Build user lookup for joins ---
        const workoutUserIds = (recentWorkoutsRes.data ?? []).map(w => w.user_id).filter(Boolean)
        const chatUserIds = (recentChatsRes.data ?? []).map(c => c.user_id).filter(Boolean)
        const weightUserIds = (weightLogsRes.data ?? []).map(w => w.user_id).filter(Boolean)
        const planUserIds = (activeWorkoutPlansRes.data ?? []).map(p => p.user_id).filter(Boolean)
        const joinUserIds = [...new Set([...workoutUserIds, ...chatUserIds, ...weightUserIds, ...planUserIds])]

        let userNameMap: Record<string, string> = {}
        if (joinUserIds.length > 0) {
          const { data: joinUsers } = await supabase
            .from('users')
            .select('id, name')
            .in('id', joinUserIds)
          for (const u of joinUsers ?? []) {
            userNameMap[u.id] = u.name
          }
        }

        // --- Compute smart insights ---
        const activeUserIds = new Set(
          (recentWorkoutUsersRes.data ?? []).map(w => w.user_id)
        )
        const inactiveUsers = (allUsersRes.data ?? []).filter(
          u => !activeUserIds.has(u.id)
        ).length

        // FIXED: Use calories_consumed instead of calories_in
        const calorieImbalance = (summariesRes.data ?? []).filter(
          s => (s.calories_consumed ?? 0) - (s.calories_out ?? 0) > 500
        ).length

        // Weight alerts: detect sudden changes (± 2kg from previous)
        let weightAlerts = 0
        const weightData = (weightLogsRes.data ?? [])
        if (weightData.length >= 2) {
          for (let i = 0; i < weightData.length - 1; i++) {
            const diff = Math.abs(weightData[i].weight_kg - weightData[i + 1].weight_kg)
            if (diff >= 2) weightAlerts++
          }
        }

        // --- Assemble ---
        const recentWorkouts: RecentWorkout[] = (recentWorkoutsRes.data ?? []).map(w => ({
          id: w.id,
          title: w.title,
          duration: w.duration,
          completed: w.completed,
          userName: userNameMap[w.user_id] ?? 'Unknown',
        }))

        const recentChats: RecentChat[] = (recentChatsRes.data ?? []).map(c => ({
          id: c.id,
          message: c.message,
          role: c.role,
          created_at: c.created_at,
          userName: userNameMap[c.user_id] ?? 'Unknown',
        }))

        const weightLogs: WeightLog[] = (weightLogsRes.data ?? []).map(w => ({
          id: w.id,
          user_id: w.user_id,
          weight_kg: w.weight_kg,
          bmi: w.bmi,
          logged_at: w.logged_at,
          userName: userNameMap[w.user_id] ?? 'Unknown',
        }))

        const workoutPlans: WorkoutPlan[] = (activeWorkoutPlansRes.data ?? []).map(p => ({
          id: p.id,
          user_id: p.user_id,
          plan_name: p.plan_name,
          goal_type: p.goal_type,
          days_per_week: p.days_per_week,
          is_active: p.is_active,
          userName: userNameMap[p.user_id] ?? 'Unknown',
        }))

        setData({
          metrics: {
            totalUsers: totalUsersRes.count ?? 0,
            activeUsersToday: activeUsersTodayRes.count ?? 0,
            foodLogsToday: foodLogsTodayRes.count ?? 0,
            workoutsToday: workoutsTodayRes.count ?? 0,
            aiChatsToday: aiChatsTodayRes.count ?? 0,
            activePlans: activePlansRes.count ?? 0,
            inactiveUsers,
            calorieImbalance,
            weightAlerts,
          },
          recentUsers: (recentUsersRes.data ?? []) as RecentUser[],
          recentWorkouts,
          recentChats,
          weightLogs,
          workoutPlans,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
        setError(message)
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
