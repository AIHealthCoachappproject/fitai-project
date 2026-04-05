import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

interface Workout {
  id: string
  user_id: string
  title: string
  duration: number
  completed: boolean
  created_at: string
}

export function UseContentData() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
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

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setWorkouts(data || [])
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
