import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

interface AIChat {
  id: string
  user_id: string
  message: string
  role: string
  created_at: string
  users?: {
    name: string
  }
}

export function UseAICoachData() {
  const [chats, setChats] = useState<AIChat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roleFilter, setRoleFilter] = useState<string>('all')

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('ai_chats')
        .select(`
          *,
          users (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setChats(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chats')
    } finally {
      setLoading(false)
    }
  }

  const filteredChats = useMemo(() => {
    let filtered = chats

    if (roleFilter !== 'all') {
      filtered = filtered.filter(chat => chat.role === roleFilter)
    }

    return filtered
  }, [chats, roleFilter])

  return {
    chats: filteredChats,
    loading,
    error,
    roleFilter,
    setRoleFilter,
    refetch: fetchChats
  }
}
