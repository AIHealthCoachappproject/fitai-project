'use client'

import { UseSettingsData } from '../hooks/useSettingsData'
import StatCard from './StatCard'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

export default function SettingsPage() {
  const { stats, loading, error } = UseSettingsData()

  if (loading) {
    return <LoadingSpinner className="h-64" />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" subtitle="Database statistics and system information" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          sub="Registered users"
          color="#22c55e"
        />
        <StatCard
          title="Total Workouts"
          value={stats.totalWorkouts.toLocaleString()}
          sub="Workout sessions"
          color="#3b82f6"
        />
        <StatCard
          title="Total Meals"
          value={stats.totalMeals.toLocaleString()}
          sub="Logged meals"
          color="#f59e0b"
        />
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Database Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-gray-400 mb-2">Tables</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• users - User accounts</li>
              <li>• user_profiles - Extended profile data</li>
              <li>• workouts - Workout sessions</li>
              <li>• food_logs - Meal tracking data</li>
              <li>• weight_logs - Weight and BMI tracking</li>
              <li>• ai_chats - AI coach conversations</li>
              <li>• daily_summaries - Daily summaries</li>
              <li>• workout_plans - Workout plans</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-400 mb-2">System Status</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#22c55e] rounded-full"></div>
                <span>Database: Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#22c55e] rounded-full"></div>
                <span>API: Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#22c55e] rounded-full"></div>
                <span>AI Coach: Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}