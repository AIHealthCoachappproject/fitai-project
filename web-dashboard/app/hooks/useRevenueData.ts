import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  name: string
  plan: string
  created_at: string
}

export function UseRevenueData() {
  const [proUsers, setProUsers] = useState<User[]>([])
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRevenueData()
  }, [])

  const fetchRevenueData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: proUsersData, error } = await supabase
        .from('users')
        .select('*')
        .eq('plan', 'pro')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProUsers(proUsersData || [])

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: recentProUsers } = await supabase
        .from('users')
        .select('created_at')
        .eq('plan', 'pro')
        .gte('created_at', thirtyDaysAgo.toISOString())

      const revenueMap = new Map<string, number>()
      for (let i = 0; i < 30; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        revenueMap.set(dateStr, 0)
      }

      recentProUsers?.forEach(user => {
        const date = new Date(user.created_at).toISOString().split('T')[0]
        revenueMap.set(date, (revenueMap.get(date) || 0) + 299)
      })

      const revenueArray = Array.from(revenueMap.entries())
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => a.date.localeCompare(b.date))

      setRevenueData(revenueArray)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue data')
    } finally {
      setLoading(false)
    }
  }

  return { proUsers, revenueData, loading, error, refetch: fetchRevenueData }
}
