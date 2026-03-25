'use client'

import { UseAICoachData } from '../hooks/useAICoachData'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

interface AIChat {
  id: string
  user_id: string
  message: string
  role: string
  created_at: string
  users?: {
    name: string
  }
}

export default function AICoachPage() {
  const { chats, loading, error, roleFilter, setRoleFilter } = UseAICoachData()

  if (loading) {
    return <LoadingSpinner className="h-64" />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-8">
      <PageHeader title="AI Coach" subtitle="AI chat conversations" />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">Filter by Role</label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#22c55e]"
        >
          <option value="all">All Messages</option>
          <option value="user">User Messages</option>
          <option value="assistant">AI Responses</option>
        </select>
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead className="bg-[#2a2a2a]">
              <tr>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Message</th>
                <th className="text-left py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {chats.map((chat: AIChat) => (
                <tr key={chat.id} className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                  <td className="py-3 px-4">{chat.users?.name || 'Unknown'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      chat.role === 'assistant'
                        ? 'bg-[#22c55e] text-black'
                        : 'bg-[#3b82f6] text-white'
                    }`}>
                      {chat.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-md truncate">{chat.message}</td>
                  <td className="py-3 px-4">
                    {new Date(chat.created_at).toLocaleString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-gray-400 text-sm">
        Showing {chats.length} messages
      </div>
    </div>
  )
}