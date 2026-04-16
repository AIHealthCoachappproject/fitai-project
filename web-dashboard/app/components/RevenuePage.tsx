'use client'

import { UseRevenueData } from '../hooks/useRevenueData'
import StatCard from './StatCard'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import ChartContainer from './ChartContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { type DashboardProfile } from '@/lib/actions'
import { useMemo } from 'react'

export default function RevenuePage() {
  const { users, loading, error } = UseRevenueData()

  const goalBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    users.forEach((u) => {
      const goal = u.goal || 'Not set'
      counts[goal] = (counts[goal] ?? 0) + 1
    })
    return Object.entries(counts).map(([goal, count]) => ({ goal, count }))
  }, [users])

  if (loading) {
    return <LoadingSpinner className="h-64" />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-8">
      <PageHeader title="User Overview" subtitle="User registration and goal analytics" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Total Users"
          value={users.length.toLocaleString()}
          sub="Registered users"
          color="#22c55e"
        />
        <StatCard
          title="Goal Categories"
          value={goalBreakdown.length.toLocaleString()}
          sub="Unique goals"
          color="#3b82f6"
        />
      </div>

      <ChartContainer title="Users by Goal">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={goalBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="goal" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="count" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer title="All Users">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Goal</th>
                <th className="text-left py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: DashboardProfile) => (
                <tr key={user.id} className="border-b border-gray-800">
                  <td className="py-2">{user.name}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.goal || 'Not set'}</td>
                  <td className="py-2">
                    {new Date(user.created_at).toLocaleDateString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartContainer>
    </div>
  )
}