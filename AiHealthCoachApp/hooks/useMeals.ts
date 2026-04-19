import { useEffect, useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import type { FoodLog, InsertFoodLog } from '@/lib/types';

interface UseMealsReturn {
  meals: FoodLog[];
  loading: boolean;
  error: string | null;
  addMeal: (meal: InsertFoodLog) => Promise<{ success: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

// Supabase PostgrestError is not an Error instance — extract .message safely
function extractMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function useMeals(userId: string | undefined): UseMealsReturn {
  const [meals, setMeals] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAddingRef = useRef(false);

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

      if (fetchError) {
        console.error('MEALS FETCH ERROR:', fetchError.code, fetchError.message, fetchError.details, fetchError.hint);
        throw fetchError;
      }
      setMeals(data ?? []);
    } catch (err) {
      const message = extractMessage(err, 'Failed to fetch meals');
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
    if (isAddingRef.current) return { success: false, error: 'Request in progress' };
    isAddingRef.current = true;

    try {
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !currentUser) {
        Alert.alert('Session Error', 'Could not verify user. Please log in again.');
        return { success: false, error: 'Not authenticated' };
      }

      // Explicitly exclude id and logged_at — let Supabase auto-generate them
      const { id: _id, logged_at: _la, user_id: _uid, ...safeFields } = meal as InsertFoodLog & { id?: string; logged_at?: string };
      const payload = {
        ...safeFields,
        user_id: currentUser.id,
        meal_type: safeFields.meal_type ?? 'Snack',
      };
      const { error: insertError } = await supabase
        .from('food_logs')
        .insert(payload);

      if (insertError) {
        console.error('MEAL INSERT ERROR:', insertError.code, insertError.message, insertError.details, insertError.hint);
        throw insertError;
      }

      await fetchMeals();
      return { success: true };
    } catch (err) {
      const message = extractMessage(err, 'Failed to add meal');
      console.error('MEAL INSERT ERROR:', message);
      return { success: false, error: message };
    } finally {
      isAddingRef.current = false;
      setLoading(false);
    }
  }, [userId, fetchMeals]);

  return { meals, loading, error, addMeal, refresh: fetchMeals };
}
