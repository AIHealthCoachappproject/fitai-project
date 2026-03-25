'use client'

import { UseNotificationsData } from '../hooks/useNotificationsData'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

interface Activity {
  id: string
  type: 'user_signup' | 'workout_completed' | 'ai_message'
  description: string
  time: string
  user_name?: string
}

export default function NotificationsPage() {
  const { activities, loading, error } = UseNotificationsData()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup':
        return '👤'
      case 'workout_completed':
        return '💪'
      case 'ai_message':
        return '🤖'
      default:
        return '📌'
    }
  }

  if (loading) {
    return <LoadingSpinner className="h-64" />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Notifications" subtitle="Recent user activities and system events" />

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {activities.map((activity: Activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-[#2a2a2a] rounded-lg">
              <div className="text-2xl">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <p className="text-gray-300">{activity.description}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(activity.time).toLocaleString('th-TH')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}