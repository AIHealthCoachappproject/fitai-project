import { useEffect, useState } from 'react'
import { getUsers, getWorkouts, getMeals } from '@/lib/actions'

interface Activity {
  id: string
  type: 'user_signup' | 'workout_completed' | 'meal_logged'
  description: string
  time: string
  user_name?: string
}

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

      const [usersRes, workoutsRes, mealsRes] = await Promise.all([
        getUsers(),
        getWorkouts(),
        getMeals(),
      ])

      const allActivities: Activity[] = []

      usersRes.data.slice(0, 10).forEach(user => {
        allActivities.push({
          id: `user-${user.id}`,
          type: 'user_signup',
          description: `${user.name ?? 'User'} signed up for FitAI`,
          time: user.created_at,
          user_name: user.name,
        })
      })

      workoutsRes.data.slice(0, 10).forEach(workout => {
        allActivities.push({
          id: `workout-${workout.id}`,
          type: 'workout_completed',
          description: `${workout.user_name ?? 'User'} logged "${workout.title}"`,
          time: workout.created_at,
          user_name: workout.user_name,
        })
      })

      mealsRes.data.slice(0, 10).forEach(meal => {
        allActivities.push({
          id: `meal-${meal.id}`,
          type: 'meal_logged',
          description: `${meal.user_name ?? 'User'} logged "${meal.food_name}" (${meal.calories} kcal)`,
          time: meal.logged_at,
          user_name: meal.user_name,
        })
      })

      allActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setActivities(allActivities.slice(0, 20))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities')
    } finally {
      setLoading(false)
    }
  }

  return { activities, loading, error, refetch: fetchActivities }
}