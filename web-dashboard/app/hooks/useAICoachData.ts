import { useEffect, useState, useMemo } from 'react'
import { getMeals, getWorkouts, type DashboardMealLog, type DashboardWorkoutLog } from '@/lib/actions'

type LogEntry = {
  id: string
  type: 'meal' | 'workout'
  description: string
  user_name: string
  logged_at: string
}

export function UseAICoachData() {
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [mealsRes, workoutsRes] = await Promise.all([getMeals(), getWorkouts()])

      const allEntries: LogEntry[] = [
        ...mealsRes.data.map((m: DashboardMealLog) => ({
          id: m.id,
          type: 'meal' as const,
          description: `${m.food_name} — ${m.calories} kcal`,
          user_name: m.user_name ?? 'Unknown',
          logged_at: m.logged_at,
        })),
        ...workoutsRes.data.map((w: DashboardWorkoutLog) => ({
          id: w.id,
          type: 'workout' as const,
          description: `${w.title} — ${w.duration_min} min`,
          user_name: w.user_name ?? 'Unknown',
          logged_at: w.completed_at,
        })),
      ]

      allEntries.sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime())
      setEntries(allEntries)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const filteredEntries = useMemo(() => {
    if (typeFilter === 'all') return entries
    return entries.filter(e => e.type === typeFilter)
  }, [entries, typeFilter])

  return {
    entries: filteredEntries,
    loading,
    error,
    typeFilter,
    setTypeFilter,
    refetch: fetchData,
  }
}
