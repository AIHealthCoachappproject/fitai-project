'use client'

import { UseAICoachData } from '../hooks/useAICoachData'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

export default function AICoachPage() {
  const { entries, loading, error, typeFilter, setTypeFilter } = UseAICoachData()

  if (loading) {
    return <LoadingSpinner className="h-64" />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Activity Feed" subtitle="Recent meal and workout logs from all users" />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">Filter by Type</label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#22c55e]"
        >
          <option value="all">All Activity</option>
          <option value="meal">Meals</option>
          <option value="workout">Workouts</option>
        </select>
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead className="bg-[#2a2a2a]">
              <tr>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-left py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                  <td className="py-3 px-4">{entry.user_name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      entry.type === 'workout'
                        ? 'bg-[#22c55e] text-black'
                        : 'bg-[#3b82f6] text-white'
                    }`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-md truncate">{entry.description}</td>
                  <td className="py-3 px-4">
                    {new Date(entry.logged_at).toLocaleString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-gray-400 text-sm">
        Showing {entries.length} entries
      </div>
    </div>
  )
}