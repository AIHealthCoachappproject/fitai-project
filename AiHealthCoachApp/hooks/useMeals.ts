import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { FoodLog, InsertFoodLog } from '@/lib/types';

interface UseMealsReturn {
  meals: FoodLog[];
  loading: boolean;
  error: string | null;
  addMeal: (meal: InsertFoodLog) => Promise<{ success: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

export function useMeals(userId: string | undefined): UseMealsReturn {
  const [meals, setMeals] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('food_logs')
        .select('id, user_id, food_name, food_name_th, calories, protein_g, carbs_g, fat_g, amount_g, meal_type, image_uri, logged_at')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setMeals(data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch meals';
      setError(message);
      console.error('MEALS FETCH ERROR:', message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const addMeal = useCallback(async (meal: InsertFoodLog) => {
    if (!userId) return { success: false, error: 'Not authenticated' };

    try {
      const { error: insertError } = await supabase
        .from('food_logs')
        .insert({ ...meal, user_id: userId });

      if (insertError) throw insertError;

      await fetchMeals();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add meal';
      console.error('MEAL INSERT ERROR:', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [userId, fetchMeals]);

  return { meals, loading, error, addMeal, refresh: fetchMeals };
}
