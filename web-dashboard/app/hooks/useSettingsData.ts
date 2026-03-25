import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function UseSettingsData() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkouts: 0,
    totalChats: 0
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

      const [usersResult, workoutsResult, chatsResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('workouts').select('*', { count: 'exact', head: true }),
        supabase.from('ai_chats').select('*', { count: 'exact', head: true })
      ])

      setStats({
        totalUsers: usersResult.count || 0,
        totalWorkouts: workoutsResult.count || 0,
        totalChats: chatsResult.count || 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch database stats')
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: fetchStats }
}
