import { useEffect, useState } from 'react'
import { getUsers, type DashboardProfile } from '@/lib/actions'

export function UseRevenueData() {
  const [users, setUsers] = useState<DashboardProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await getUsers()
      if (error) throw new Error(error)

      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return { users, loading, error, refetch: fetchData }
}
