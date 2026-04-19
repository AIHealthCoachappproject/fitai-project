import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { WeightLog, InsertWeightLog } from '@/lib/types';

interface UseProgressReturn {
  weightLogs: WeightLog[];
  loading: boolean;
  error: string | null;
  addWeight: (entry: InsertWeightLog) => Promise<{ success: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

export function useProgress(userId: string | undefined): UseProgressReturn {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeightLogs = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('weight_logs')
        .select('id, user_id, weight_kg, bmi, logged_at')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setWeightLogs(data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weight logs';
      setError(message);
      console.error('WEIGHT LOGS FETCH ERROR:', message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWeightLogs();
  }, [fetchWeightLogs]);

  const addWeight = useCallback(async (entry: InsertWeightLog) => {
    if (!userId) return { success: false, error: 'Not authenticated' };

    try {
      const { error: insertError } = await supabase
        .from('weight_logs')
        .insert({ ...entry, user_id: userId });

      if (insertError) throw insertError;

      await fetchWeightLogs();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add weight log';
      console.error('WEIGHT INSERT ERROR:', message);
      return { success: false, error: message };
    }
  }, [userId, fetchWeightLogs]);

  return { weightLogs, loading, error, addWeight, refresh: fetchWeightLogs };
}
