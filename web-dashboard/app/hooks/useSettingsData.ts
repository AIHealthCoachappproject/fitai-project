import { useEffect, useState } from 'react'
import { getDashboardStats } from '@/lib/actions'

export function UseSettingsData() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkouts: 0,
    totalMeals: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await getDashboardStats()
      if (error) throw new Error(error)

      setStats({
        totalUsers: data.totalUsers,
        totalWorkouts: data.totalWorkouts,
        totalMeals: data.totalMeals
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch database stats')
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: fetchStats }
}
