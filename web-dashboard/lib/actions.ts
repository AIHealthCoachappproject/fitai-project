'use server'

import { supabaseAdmin } from './supabase-admin'

// ---------- Types (matching real Supabase tables) ----------

export interface DashboardUser {
  id: string
  email: string
  name: string
  goal: string
  weight: number
  plan: string
  created_at: string
}

export interface DashboardFoodLog {
  id: string
  user_id: string
  food_name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  meal_type: string
  logged_at: string
  user_name?: string
}

export interface DashboardWorkout {
  id: string
  user_id: string
  title: string
  duration: number
  completed: boolean
  created_at: string
  user_name?: string
}

export interface DashboardWeightLog {
  id: string
  user_id: string
  weight_kg: number
  bmi: number
  logged_at: string
  user_name?: string
}

export interface DashboardStats {
  totalUsers: number
  totalMeals: number
  totalWorkouts: number
  totalWeightLogs: number
}

// Keep old aliases so existing dashboard components compile
export type DashboardProfile = DashboardUser
export type DashboardMealLog = DashboardFoodLog
export type DashboardWorkoutLog = DashboardWorkout

// ---------- Queries ----------

export async function getUsers(): Promise<{ data: DashboardUser[]; error: string | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, goal, weight, plan, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data: data ?? [], error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch users'
    console.error('getUsers error:', message)
    return { data: [], error: message }
  }
}

export async function getMeals(): Promise<{ data: DashboardFoodLog[]; error: string | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('food_logs')
      .select('id, user_id, food_name, calories, protein_g, carbs_g, fat_g, meal_type, logged_at')
      .order('logged_at', { ascending: false })
      .limit(100)

    if (error) throw error

    const userIds = [...new Set((data ?? []).map((m) => m.user_id))]
    const nameMap = await getUserNameMap(userIds)

    const enriched: DashboardFoodLog[] = (data ?? []).map((m) => ({
      ...m,
      user_name: nameMap[m.user_id] ?? 'Unknown',
    }))

    return { data: enriched, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch meals'
    console.error('getMeals error:', message)
    return { data: [], error: message }
  }
}

export async function getWorkouts(): Promise<{ data: DashboardWorkout[]; error: string | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('workouts')
      .select('id, user_id, title, duration, completed, created_at')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    const userIds = [...new Set((data ?? []).map((w) => w.user_id))]
    const nameMap = await getUserNameMap(userIds)

    const enriched: DashboardWorkout[] = (data ?? []).map((w) => ({
      ...w,
      user_name: nameMap[w.user_id] ?? 'Unknown',
    }))

    return { data: enriched, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch workouts'
    console.error('getWorkouts error:', message)
    return { data: [], error: message }
  }
}

export async function getWeightLogs(): Promise<{ data: DashboardWeightLog[]; error: string | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('weight_logs')
      .select('id, user_id, weight_kg, bmi, logged_at')
      .order('logged_at', { ascending: false })
      .limit(100)

    if (error) throw error

    const userIds = [...new Set((data ?? []).map((w) => w.user_id))]
    const nameMap = await getUserNameMap(userIds)

    const enriched: DashboardWeightLog[] = (data ?? []).map((w) => ({
      ...w,
      user_name: nameMap[w.user_id] ?? 'Unknown',
    }))

    return { data: enriched, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch weight logs'
    console.error('getWeightLogs error:', message)
    return { data: [], error: message }
  }
}

export async function getDashboardStats(): Promise<{ data: DashboardStats; error: string | null }> {
  try {
    const [usersRes, mealsRes, workoutsRes, weightRes] = await Promise.all([
      supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('food_logs').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('workouts').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('weight_logs').select('id', { count: 'exact', head: true }),
    ])

    return {
      data: {
        totalUsers: usersRes.count ?? 0,
        totalMeals: mealsRes.count ?? 0,
        totalWorkouts: workoutsRes.count ?? 0,
        totalWeightLogs: weightRes.count ?? 0,
      },
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch stats'
    console.error('getDashboardStats error:', message)
    return {
      data: { totalUsers: 0, totalMeals: 0, totalWorkouts: 0, totalWeightLogs: 0 },
      error: message,
    }
  }
}

// ---------- Helpers ----------

async function getUserNameMap(userIds: string[]): Promise<Record<string, string>> {
  if (userIds.length === 0) return {}

  const { data } = await supabaseAdmin
    .from('users')
    .select('id, name')
    .in('id', userIds)

  const map: Record<string, string> = {}
  for (const u of data ?? []) {
    map[u.id] = u.name ?? 'Unknown'
  }
  return map
}
