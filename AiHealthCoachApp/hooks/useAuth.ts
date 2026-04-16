import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types';

interface UseAuthReturn {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  upsertProfile: (data: Partial<Omit<Profile, 'id' | 'email' | 'created_at'>>) => Promise<{ success: boolean; error?: string }>;
}

export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch joined data from `users` + `user_profiles`
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // 1. Get user row
      const { data: userRow, error: userErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userErr && userErr.code !== 'PGRST116') {
        console.error('FETCH USER ERROR:', userErr.message);
        return;
      }

      // 2. Get user_profiles row (may not exist yet)
      const { data: profileRow, error: profileErr } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileErr && profileErr.code !== 'PGRST116') {
        console.error('FETCH USER_PROFILES ERROR:', profileErr.message);
      }

      if (userRow) {
        setProfile({
          id: userRow.id,
          email: userRow.email ?? '',
          name: userRow.name ?? '',
          goal: userRow.goal ?? '',
          weight: userRow.weight ?? 0,
          plan: userRow.plan ?? 'free',
          created_at: userRow.created_at ?? '',
          age: profileRow?.age ?? 0,
          height_cm: profileRow?.height_cm ?? 0,
          gender: profileRow?.gender ?? '',
          activity_level: profileRow?.activity_level ?? '',
          target_weight_kg: profileRow?.target_weight_kg ?? 0,
          daily_calorie: profileRow?.daily_calorie ?? 0,
          bmr: profileRow?.bmr ?? 0,
        });
      }
    } catch (err) {
      console.error('Profile fetch exception:', err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session: currentSession }, error: sessErr } = await supabase.auth.getSession();
        if (sessErr) {
          console.error('AUTH INIT ERROR:', sessErr.message);
        }
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (err) {
        console.error('AUTH INIT EXCEPTION:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

      if (signUpError) {
        console.error('SIGNUP ERROR:', signUpError.message);
        // Rate limit → tell user to wait or use existing account
        if (signUpError.message.toLowerCase().includes('rate limit')) {
          const msg = 'Too many signup attempts. Please wait a minute and try again, or log in with an existing account.';
          setError(msg);
          return { success: false, error: msg };
        }
        setError(signUpError.message);
        return { success: false, error: signUpError.message };
      }

      if (!data.user) {
        return { success: false, error: 'Registration failed — no user returned' };
      }

      // Insert row into `users` table so the rest of the app works
      const { error: insertErr } = await supabase
        .from('users')
        .upsert(
          { id: data.user.id, email: data.user.email ?? email, name: '', goal: '', plan: 'free' },
          { onConflict: 'id' },
        );

      if (insertErr) {
        console.error('USERS UPSERT ERROR:', insertErr.message);
        // Non-fatal — auth account exists, users row may have been created by a trigger
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      console.error('SIGNUP EXCEPTION:', message);
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        console.error('LOGIN ERROR:', signInError.message);
        setError(signInError.message);
        return { success: false, error: signInError.message };
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      console.error('LOGIN EXCEPTION:', message);
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setSession(null);
      setUser(null);
    } catch (err) {
      console.error('SIGNOUT ERROR:', err);
    }
  }, []);

  /**
   * Upserts data into both `users` and `user_profiles` tables.
   * Fields belonging to `users`: name, goal, weight, plan
   * Fields belonging to `user_profiles`: age, height_cm, gender, activity_level, target_weight_kg, daily_calorie, bmr
   */
  const upsertProfile = useCallback(
    async (data: Partial<Omit<Profile, 'id' | 'email' | 'created_at'>>) => {
      if (!user) return { success: false, error: 'Not authenticated' };

      try {
        // Split fields between the two tables
        const usersData: Record<string, unknown> = { id: user.id };
        const profileData: Record<string, unknown> = { id: user.id };

        const usersFields = ['name', 'goal', 'weight', 'plan'] as const;
        const profileFields = ['age', 'height_cm', 'gender', 'activity_level', 'target_weight_kg', 'daily_calorie', 'bmr'] as const;

        for (const k of usersFields) {
          if (k in data) usersData[k] = (data as Record<string, unknown>)[k];
        }
        for (const k of profileFields) {
          if (k in data) profileData[k] = (data as Record<string, unknown>)[k];
        }

        // Upsert users if there's something to write
        if (Object.keys(usersData).length > 1) {
          const { error: uErr } = await supabase
            .from('users')
            .upsert(usersData, { onConflict: 'id' });
          if (uErr) {
            console.error('USERS UPSERT ERROR:', uErr.message);
            return { success: false, error: uErr.message };
          }
        }

        // Upsert user_profiles if there's something to write
        if (Object.keys(profileData).length > 1) {
          const { error: pErr } = await supabase
            .from('user_profiles')
            .upsert(profileData, { onConflict: 'id' });
          if (pErr) {
            console.error('USER_PROFILES UPSERT ERROR:', pErr.message);
            return { success: false, error: pErr.message };
          }
        }

        await fetchProfile(user.id);
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Profile update failed';
        console.error('UPSERT PROFILE EXCEPTION:', message);
        return { success: false, error: message };
      }
    },
    [user, fetchProfile],
  );

  return {
    session,
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    upsertProfile,
  };
}
