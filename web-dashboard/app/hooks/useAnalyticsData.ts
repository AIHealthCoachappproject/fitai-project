import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AnalyticsStats {
  totalWorkouts: number
  completedWorkouts: number
  totalMessages: number
}

export function UseAnalyticsData() {
  const [stats, setStats] = useState<AnalyticsStats>({
    totalWorkouts: 0,
    completedWorkouts: 0,
    totalMessages: 0

  })
  const [workoutsData, setWorkoutsData] = useState<{ date: string; count: number }[]>([])
  const [popularWorkouts, setPopularWorkouts] = useState<{ title: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { count: totalWorkouts } = await supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })

      const { count: completedWorkouts } = await supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('completed', true)

      const { count: totalMessages } = await supabase
        .from('ai_chats')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalWorkouts: totalWorkouts || 0,
        completedWorkouts: completedWorkouts || 0,
        totalMessages: totalMessages || 0
      })

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { data: workouts } = await supabase
        .from('workouts')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString())

      const workoutsMap = new Map<string, number>()
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        workoutsMap.set(dateStr, 0)
      }

      workouts?.forEach(workout => {
        const date = new Date(workout.created_at).toISOString().split('T')[0]
        workoutsMap.set(date, (workoutsMap.get(date) || 0) + 1)
      })

      const workoutsArray = Array.from(workoutsMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))

      setWorkoutsData(workoutsArray)

      const { data: workoutTitles } = await supabase
        .from('workouts')
        .select('title')

      const titleCounts = workoutTitles?.reduce((acc: Record<string, number>, workout: { title: string }) => {
        acc[workout.title] = (acc[workout.title] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const popular = Object.entries(titleCounts)
        .map(([title, count]) => ({ title, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      setPopularWorkouts(popular)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return { stats, workoutsData, popularWorkouts, loading, error, refetch: fetchAnalyticsData }
}
