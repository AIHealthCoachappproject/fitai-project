'use server'

import { supabaseAdmin } from './supabase-admin'

// ---------- Types (matching real Supabase tables) ----------

export interface DashboardUser {
  id: string
  name: string | null
  avatar_url: string | null
  age: number | null
  gender: string | null
  goal: string | null
  weight_kg: number | null
  onboarding_completed: boolean
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
  type: string | null
  duration_min: number | null
  calories_burned: number | null
  completed: boolean
  completed_at: string
  user_name?: string
}

export interface DashboardWeightLog {
  id: string
  user_id: string
  weight_kg: number
  bmi: number | null
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
      .from('user_profiles')
      .select('id, name, avatar_url, age, gender, goal, weight_kg, onboarding_completed')
      .order('id', { ascending: false })

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
      .select('id, user_id, title, type, duration_min, calories_burned, completed, completed_at')
      .order('completed_at', { ascending: false })
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
      supabaseAdmin.from('user_profiles').select('id', { count: 'exact', head: true }),
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
    .from('user_profiles')
    .select('id, name')
    .in('id', userIds)

  const map: Record<string, string> = {}
  for (const u of data ?? []) {
    map[u.id] = u.name ?? 'Unknown'
  }
  return map
}
