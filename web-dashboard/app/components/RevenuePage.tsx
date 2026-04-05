'use client'

import { UseRevenueData } from '../hooks/useRevenueData'
import StatCard from './StatCard'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import ChartContainer from './ChartContainer'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface User {
  id: string
  email: string
  name: string
  plan: string
  created_at: string
}

export default function RevenuePage() {
  const { proUsers, revenueData, loading, error } = UseRevenueData()

  const proCount = proUsers.length
  const mrr = proCount * 299

  if (loading) {
    return <LoadingSpinner className="h-64" />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Revenue" subtitle="Subscription and revenue analytics" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Pro Subscribers"
          value={proCount.toLocaleString()}
          sub="Active paid users"
          color="#22c55e"
        />
        <StatCard
          title="Monthly Recurring Revenue"
          value={`$${mrr.toLocaleString()}`}
          sub="MRR from subscriptions"
          color="#ef4444"
        />
      </div>

      <ChartContainer title="Monthly Revenue Trend">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151' }}
              labelStyle={{ color: '#fff' }}
              formatter={(value) => [`$${value}`, 'Revenue']}
            />
            <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer title="Pro Subscribers">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {proUsers.map((user: User) => (
                <tr key={user.id} className="border-b border-gray-800">
                  <td className="py-2">{user.name}</td>
                  <td className="py-2">{user.email}</td>
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