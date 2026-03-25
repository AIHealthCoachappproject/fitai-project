'use client'

import { UseAnalyticsData } from '../hooks/useAnalyticsData'
import StatCard from './StatCard'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import ChartContainer from './ChartContainer'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AnalyticsPage() {
  const { stats, workoutsData, popularWorkouts, loading, error } = UseAnalyticsData()

  if (loading) {
    return <LoadingSpinner className="h-64" />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Analytics" subtitle="Workout and AI Chat Statistics" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Workouts"
          value={stats.totalWorkouts.toLocaleString()}
          sub="All workouts"
          color="#22c55e"
        />
        <StatCard
          title="Completed Workouts"
          value={stats.completedWorkouts.toLocaleString()}
          sub="Finished workouts"
          color="#3b82f6"
        />
        <StatCard
          title="AI Chat Messages"
          value={stats.totalMessages.toLocaleString()}
          sub="Total messages"
          color="#f59e0b"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Workouts Per Day (Last 7 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={workoutsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Most Popular Workouts">
          <div className="space-y-4">
            {popularWorkouts.map((workout: { title: string; count: number }, index: number) => (
              <div key={workout.title} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#22c55e]">#{index + 1}</span>
                  <span className="text-gray-300">{workout.title}</span>
                </div>
                <span className="text-gray-400">{workout.count} times</span>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>
    </div>
  )
}