import { useEffect, useState, useMemo } from 'react'
import { getWorkouts, type DashboardWorkoutLog } from '@/lib/actions'

export function UseContentData() {
  const [workouts, setWorkouts] = useState<DashboardWorkoutLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedFilter, setCompletedFilter] = useState<string>('all')

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await getWorkouts()
      if (error) throw new Error(error)

      setWorkouts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workouts')
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkouts = useMemo(() => {
    let filtered = workouts

    if (completedFilter !== 'all') {
      filtered = filtered.filter(workout => workout.completed.toString() === completedFilter)
    }

    return filtered
  }, [workouts, completedFilter])

  return {
    workouts: filteredWorkouts,
    loading,
    error,
    completedFilter,
    setCompletedFilter,
    refetch: fetchWorkouts
  }
}
