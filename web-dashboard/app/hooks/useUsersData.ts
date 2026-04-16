import { useEffect, useState, useMemo } from 'react'
import { getUsers, type DashboardProfile } from '@/lib/actions'

export function UseUsersData() {
  const [users, setUsers] = useState<DashboardProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [goalFilter, setGoalFilter] = useState<string>('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await getUsers()
      if (error) throw new Error(error)

      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = useMemo(() => {
    let filtered = users

    if (goalFilter !== 'all') {
      filtered = filtered.filter(user => user.goal === goalFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        (user.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [users, goalFilter, searchTerm])

  return {
    users: filteredUsers,
    loading,
    error,
    goalFilter,
    setGoalFilter,
    searchTerm,
    setSearchTerm,
    refetch: fetchUsers
  }
}
