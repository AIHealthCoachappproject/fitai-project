'use client'

import { UseContentData } from '../hooks/useContentData'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

import { type DashboardWorkoutLog } from '@/lib/actions'

export default function ContentPage() {
  const { workouts, loading, error, completedFilter, setCompletedFilter } = UseContentData()

  if (loading) {
    return <LoadingSpinner className="h-64" />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Content" subtitle="Manage workout content" />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">Filter by Completion</label>
        <select
          value={completedFilter}
          onChange={(e) => setCompletedFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#22c55e]"
        >
          <option value="all">All Workouts</option>
          <option value="true">Completed</option>
          <option value="false">Not Completed</option>
        </select>
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead className="bg-[#2a2a2a]">
              <tr>
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Duration (min)</th>
                <th className="text-left py-3 px-4">Completed</th>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout: DashboardWorkoutLog) => (
                <tr key={workout.id} className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                  <td className="py-3 px-4">{workout.title}</td>
                  <td className="py-3 px-4">{workout.duration_min}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      workout.completed
                        ? 'bg-[#22c55e] text-black'
                        : 'bg-gray-600 text-white'
                    }`}>
                      {workout.completed ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4">{workout.user_name ?? 'Unknown'}</td>
                  <td className="py-3 px-4">
                    {new Date(workout.created_at).toLocaleDateString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-gray-400 text-sm">
        Showing {workouts.length} workouts
      </div>
    </div>
  )
}