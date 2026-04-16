'use client'

import { UseUsersData } from '../hooks/useUsersData'
import type { DashboardProfile } from '@/lib/actions'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

export default function UsersPage() {
  const { users, loading, error, goalFilter, setGoalFilter, searchTerm, setSearchTerm } = UseUsersData()

  if (loading) {
    return <LoadingSpinner className="h-64" />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Users" subtitle="Manage all registered users" />

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Filter by Goal</label>
          <select
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#22c55e]"
          >
            <option value="all">All Goals</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="toned_body">Toned Body</option>
            <option value="healthy">Healthy Lifestyle</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Search by Name</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#22c55e]"
          />
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead className="bg-[#2a2a2a]">
              <tr>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Goal</th>
                <th className="text-left py-3 px-4">Weight</th>
                <th className="text-left py-3 px-4">Plan</th>
                <th className="text-left py-3 px-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: DashboardProfile) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                  <td className="py-3 px-4">{user.name ?? '—'}</td>
                  <td className="py-3 px-4">{user.email ?? '—'}</td>
                  <td className="py-3 px-4 capitalize">{(user.goal ?? '').replace('_', ' ')}</td>
                  <td className="py-3 px-4">{user.weight ? `${user.weight} kg` : '—'}</td>
                  <td className="py-3 px-4 uppercase">{user.plan ?? 'free'}</td>
                  <td className="py-3 px-4">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-gray-400 text-sm">
        Showing {users.length} users
      </div>
    </div>
  )
}