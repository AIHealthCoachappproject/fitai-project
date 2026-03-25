import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  name: string
  goal: string
  weight: number
  plan: string
  created_at: string
}

export function UseUsersData() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = useMemo(() => {
    let filtered = users

    if (planFilter !== 'all') {
      filtered = filtered.filter(user => user.plan === planFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [users, planFilter, searchTerm])

  return {
    users: filteredUsers,
    loading,
    error,
    planFilter,
    setPlanFilter,
    searchTerm,
    setSearchTerm,
    refetch: fetchUsers
  }
}
