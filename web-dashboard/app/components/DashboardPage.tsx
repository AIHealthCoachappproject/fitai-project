'use client'

import { UseDashboardData } from '../hooks/useDashboardData'
import StatCard from './StatCard'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import DataTable from './DataTable'
import ChartContainer from './ChartContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface User {
  id: string
  email: string
  name: string
  goal: string
  weight: number
  plan: string
  created_at: string
}

export default function DashboardPage() {
  const { stats, signupsData, goalData, recentUsers, loading, error } = UseDashboardData()

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

  if (loading) {
    return <LoadingSpinner className="h-64" />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  const userColumns = [
    { key: 'name' as keyof User, header: 'Name' },
    { key: 'email' as keyof User, header: 'Email' },
    {
      key: 'goal' as keyof User,
      header: 'Goal',
      render: (value: string) => value.replace('_', ' ').toUpperCase()
    },
    { key: 'plan' as keyof User, header: 'Plan', render: (value: string) => value.toUpperCase() },
    {
      key: 'created_at' as keyof User,
      header: 'Joined',
      render: (value: string) => new Date(value).toLocaleDateString('th-TH')
    }
  ]

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" subtitle="FitAI Health Coach Admin Overview" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          sub="Registered users"
          color="#22c55e"
        />
        <StatCard
          title="Pro Subscribers"
          value={stats.proUsers.toLocaleString()}
          sub="Paid users"
          color="#3b82f6"
        />
        <StatCard
          title="Active Today"
          value={stats.activeToday.toLocaleString()}
          sub="New signups"
          color="#f59e0b"
        />
        <StatCard
          title="Monthly Recurring Revenue"
          value={`$${stats.mrr.toLocaleString()}`}
          sub="MRR"
          color="#ef4444"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Signups Last 7 Days">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={signupsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Goal Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={goalData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {goalData.map((entry: { name: string; value: number }, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <ChartContainer title="Recent Users">
        <DataTable data={recentUsers} columns={userColumns} />
      </ChartContainer>
    </div>
  )
}