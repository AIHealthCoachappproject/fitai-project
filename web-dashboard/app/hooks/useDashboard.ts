'use client'

import { useState, useEffect } from 'react'
import {
  getUsers,
  getMeals,
  getWorkouts,
  getWeightLogs,
  getDashboardStats,
  type DashboardProfile,
  type DashboardMealLog,
  type DashboardWorkoutLog,
  type DashboardWeightLog,
  type DashboardStats,
} from '@/lib/actions'

export type { DashboardProfile, DashboardMealLog, DashboardWorkoutLog, DashboardWeightLog, DashboardStats }

export interface DashboardData {
  stats: DashboardStats
  users: DashboardProfile[]
  meals: DashboardMealLog[]
  workouts: DashboardWorkoutLog[]
  weightLogs: DashboardWeightLog[]
}

interface UseDashboardReturn {
  data: DashboardData | null
  loading: boolean
  error: string | null
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [statsRes, usersRes, mealsRes, workoutsRes, weightRes] = await Promise.all([
          getDashboardStats(),
          getUsers(),
          getMeals(),
          getWorkouts(),
          getWeightLogs(),
        ])

        const firstError = statsRes.error || usersRes.error || mealsRes.error || workoutsRes.error || weightRes.error
        if (firstError) {
          setError(firstError)
        }

        setData({
          stats: statsRes.data,
          users: usersRes.data,
          meals: mealsRes.data,
          workouts: workoutsRes.data,
          weightLogs: weightRes.data,
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
