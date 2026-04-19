import { useEffect, useState } from 'react'
import { getDashboardStats, getWorkouts, type DashboardWorkoutLog } from '@/lib/actions'

interface AnalyticsStats {
  totalWorkouts: number
  totalMeals: number
  totalUsers: number
}

export function UseAnalyticsData() {
  const [stats, setStats] = useState<AnalyticsStats>({
    totalWorkouts: 0,
    totalMeals: 0,
    totalUsers: 0,
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

      const [statsRes, workoutsRes] = await Promise.all([
        getDashboardStats(),
        getWorkouts(),
      ])

      setStats({
        totalWorkouts: statsRes.data.totalWorkouts,
        totalMeals: statsRes.data.totalMeals,
        totalUsers: statsRes.data.totalUsers,
      })

      const workoutsMap = new Map<string, number>()
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        workoutsMap.set(date.toISOString().split('T')[0], 0)
      }

      workoutsRes.data.forEach((w: DashboardWorkoutLog) => {
        if (!w.completed_at) return
        const parsed = new Date(w.completed_at)
        if (isNaN(parsed.getTime())) return
        const date = parsed.toISOString().split('T')[0]
        if (workoutsMap.has(date)) {
          workoutsMap.set(date, (workoutsMap.get(date) ?? 0) + 1)
        }
      })

      setWorkoutsData(
        Array.from(workoutsMap.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date))
      )

      const titleCounts: Record<string, number> = {}
      workoutsRes.data.forEach((w: DashboardWorkoutLog) => {
        titleCounts[w.title] = (titleCounts[w.title] ?? 0) + 1
      })
      setPopularWorkouts(
        Object.entries(titleCounts)
          .map(([title, count]) => ({ title, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return { stats, workoutsData, popularWorkouts, loading, error, refetch: fetchAnalyticsData }
}
