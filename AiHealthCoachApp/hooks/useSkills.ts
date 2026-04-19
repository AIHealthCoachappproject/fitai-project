import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { SkillLog, InsertSkillLog } from '@/lib/types';

interface UseSkillsReturn {
  skills: SkillLog[];
  loading: boolean;
  error: string | null;
  addSkill: (skill: InsertSkillLog) => Promise<{ success: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

export function useSkills(userId: string | undefined): UseSkillsReturn {
  const [skills, setSkills] = useState<SkillLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('skill_logs')
        .select('id, user_id, skill_name, duration_min, successful_attempts, logged_at')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setSkills(data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch skills';
      setError(message);
      console.error('SKILLS FETCH ERROR:', message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const addSkill = useCallback(async (skill: InsertSkillLog) => {
    if (!userId) return { success: false, error: 'Not authenticated' };

    try {
      const { error: insertError } = await supabase
        .from('skill_logs')
        .insert({ ...skill, user_id: userId });

      if (insertError) throw insertError;

      await fetchSkills();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add skill';
      console.error('SKILL INSERT ERROR:', message);
      return { success: false, error: message };
    }
  }, [userId, fetchSkills]);

  return { skills, loading, error, addSkill, refresh: fetchSkills };
}
