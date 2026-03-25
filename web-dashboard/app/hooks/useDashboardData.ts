import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  totalUsers: number
  proUsers: number
  activeToday: number
  mrr: number
}

interface User {
  id: string
  email: string
  name: string
  goal: string
  weight: number
  plan: string
  created_at: string
}

export function UseDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    proUsers: 0,
    activeToday: 0,
    mrr: 0
  })
  const [signupsData, setSignupsData] = useState<{ date: string; count: number }[]>([])
  const [goalData, setGoalData] = useState<{ name: string; value: number }[]>([])
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      const { count: proUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('plan', 'pro')

      const today = new Date().toISOString().split('T')[0]
      const { count: activeToday } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)

      const mrr = (proUsers || 0) * 299

      setStats({
        totalUsers: totalUsers || 0,
        proUsers: proUsers || 0,
        activeToday: activeToday || 0,
        mrr
      })

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { data: signups } = await supabase
        .from('users')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString())

      const signupsMap = new Map<string, number>()
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        signupsMap.set(dateStr, 0)
      }

      signups?.forEach(user => {
        const date = new Date(user.created_at).toISOString().split('T')[0]
        signupsMap.set(date, (signupsMap.get(date) || 0) + 1)
      })

      const signupsArray = Array.from(signupsMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))

      setSignupsData(signupsArray)

      const { data: goals } = await supabase
        .from('users')
        .select('goal')

      const goalCounts = goals?.reduce((acc: Record<string, number>, user: { goal: string }) => {
        acc[user.goal] = (acc[user.goal] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const goalArray = Object.entries(goalCounts).map(([name, value]) => ({
        name: name.replace('_', ' ').toUpperCase(),
        value
      }))

      setGoalData(goalArray)

      const { data: recent } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentUsers(recent || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return { stats, signupsData, goalData, recentUsers, loading, error, refetch: fetchDashboardData }
}
