import { useEffect, useState } from 'react'
import { getUsers, getDashboardStats, type DashboardProfile } from '@/lib/actions'

interface DashboardStats {
  totalUsers: number
  totalMeals: number
  totalWorkouts: number
}

export function UseDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMeals: 0,
    totalWorkouts: 0,
  })
  const [signupsData, setSignupsData] = useState<{ date: string; count: number }[]>([])
  const [goalData, setGoalData] = useState<{ name: string; value: number }[]>([])
  const [recentUsers, setRecentUsers] = useState<DashboardProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsRes, usersRes] = await Promise.all([
        getDashboardStats(),
        getUsers(),
      ])

      if (statsRes.error) throw new Error(statsRes.error)
      if (usersRes.error) throw new Error(usersRes.error)

      setStats({
        totalUsers: statsRes.data.totalUsers,
        totalMeals: statsRes.data.totalMeals,
        totalWorkouts: statsRes.data.totalWorkouts,
      })

      // Signups per day (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const signupsMap = new Map<string, number>()
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        signupsMap.set(date.toISOString().split('T')[0], 0)
      }

      usersRes.data.forEach(user => {
        const date = new Date(user.created_at).toISOString().split('T')[0]
        if (signupsMap.has(date)) {
          signupsMap.set(date, (signupsMap.get(date) ?? 0) + 1)
        }
      })

      setSignupsData(
        Array.from(signupsMap.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date))
      )

      // Goal distribution
      const goalCounts: Record<string, number> = {}
      usersRes.data.forEach(user => {
        const goal = user.goal ?? 'unknown'
        goalCounts[goal] = (goalCounts[goal] ?? 0) + 1
      })
      setGoalData(
        Object.entries(goalCounts).map(([name, value]) => ({
          name: name.replace('_', ' ').toUpperCase(),
          value,
        }))
      )

      setRecentUsers(usersRes.data.slice(0, 5))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return { stats, signupsData, goalData, recentUsers, loading, error, refetch: fetchDashboardData }
}
