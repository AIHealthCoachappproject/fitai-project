import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { WorkoutLog, InsertWorkoutLog } from '@/lib/types';

interface UseWorkoutsReturn {
  workouts: WorkoutLog[];
  loading: boolean;
  error: string | null;
  addWorkout: (workout: InsertWorkoutLog) => Promise<{ success: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

export function useWorkouts(userId: string | undefined): UseWorkoutsReturn {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('workouts')
        .select('id, user_id, title, duration, completed, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setWorkouts(data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch workouts';
      setError(message);
      console.error('WORKOUTS FETCH ERROR:', message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const addWorkout = useCallback(async (workout: InsertWorkoutLog) => {
    if (!userId) return { success: false, error: 'Not authenticated' };

    try {
      const { error: insertError } = await supabase
        .from('workouts')
        .insert({ ...workout, user_id: userId });

      if (insertError) throw insertError;

      await fetchWorkouts();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add workout';
      console.error('WORKOUT INSERT ERROR:', message);
      return { success: false, error: message };
    }
  }, [userId, fetchWorkouts]);

  return { workouts, loading, error, addWorkout, refresh: fetchWorkouts };
}
