import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Activity {
  id: string
  type: 'user_signup' | 'workout_completed' | 'ai_message'
  description: string
  time: string
  user_name?: string
}

const getUserName = (users?: { name: string }[]) =>
  users?.[0]?.name || 'User'

export function UseNotificationsData() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      setError(null)

      const activities: Activity[] = []

      const { data: users } = await supabase
        .from('users')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      users?.forEach(user => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user_signup',
          description: `${user.name} signed up for FitAI`,
          time: user.created_at,
          user_name: user.name
        })
      })

      const { data: workouts } = await supabase
        .from('workouts')
        .select('id, user_id, title, created_at, users(name)')
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(10)

      workouts?.forEach(workout => {
        const name = getUserName(workout.users)

        activities.push({
          id: `workout-${workout.id}`,
          type: 'workout_completed',
          description: `${name} completed "${workout.title}"`,
          time: workout.created_at,
          user_name: name
        })
      })

      const { data: messages } = await supabase
        .from('ai_chats')
        .select('id, user_id, message, created_at, users(name)')
        .order('created_at', { ascending: false })
        .limit(10)

      messages?.forEach(message => {
        const name = getUserName(message.users)

        activities.push({
          id: `message-${message.id}`,
          type: 'ai_message',
          description: `${name} asked AI: "${message.message}"`,
          time: message.created_at,
          user_name: name
        })
      })

      activities.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      )

      setActivities(activities.slice(0, 20))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities')
    } finally {
      setLoading(false)
    }
  }

  return { activities, loading, error, refetch: fetchActivities }
}