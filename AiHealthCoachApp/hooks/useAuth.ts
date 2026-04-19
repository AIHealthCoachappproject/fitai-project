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

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const email = authUser?.email ?? '';

      const { data: p, error: profileErr } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr && profileErr.code !== 'PGRST116') {
        console.error('FETCH USER_PROFILES ERROR:', profileErr.message);
      }

      setProfile({
        id: userId,
        email,
        created_at: authUser?.created_at ?? '',
        name: p?.name ?? '',
        avatar_url: p?.avatar_url ?? '',
        age: p?.age ?? 0,
        gender: p?.gender ?? '',
        height_cm: p?.height_cm ?? 0,
        weight_kg: p?.weight_kg ?? 0,
        goal: p?.goal ?? '',
        activity_level: p?.activity_level ?? '',
        daily_calorie_goal: p?.daily_calorie_goal ?? 0,
        daily_protein_goal: p?.daily_protein_goal ?? 0,
        onboarding_completed: p?.onboarding_completed ?? false,
      });
    } catch (err) {
      console.error('Profile fetch exception:', err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session: currentSession }, error: sessErr } = await supabase.auth.getSession();
        if (sessErr) console.error('AUTH INIT ERROR:', sessErr.message);
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) await fetchProfile(currentSession.user.id);
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
        if (newSession?.user) await fetchProfile(newSession.user.id);
        else setProfile(null);
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
        if (signUpError.message.toLowerCase().includes('rate limit')) {
          const msg = 'Too many signup attempts. Please wait a minute and try again.';
          setError(msg);
          return { success: false, error: msg };
        }
        setError(signUpError.message);
        return { success: false, error: signUpError.message };
      }

      if (!data.user) return { success: false, error: 'Registration failed — no user returned' };

      // Trigger auto-creates user_profiles row. Ensure onboarding_completed=false.
      const { error: profileErr } = await supabase
        .from('user_profiles')
        .upsert({ id: data.user.id, onboarding_completed: false }, { onConflict: 'id' });
      if (profileErr) console.error('USER_PROFILES INIT ERROR:', profileErr.message);

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

  const upsertProfile = useCallback(
    async (data: Partial<Omit<Profile, 'id' | 'email' | 'created_at'>>) => {
      try {
        console.log('[upsertProfile] fetching authenticated user...');
        const { data: { user: authUser }, error: userErr } = await supabase.auth.getUser();

        if (userErr) {
          console.log('[upsertProfile] getUser error:', userErr.message);
          return { success: false, error: userErr.message };
        }
        if (!authUser) {
          console.log('[upsertProfile] no authenticated user');
          return { success: false, error: 'Not authenticated' };
        }

        const payload = { id: authUser.id, ...data };
        console.log('[upsertProfile] upserting payload:', JSON.stringify(payload));

        const { error: pErr } = await supabase
          .from('user_profiles')
          .upsert(payload, { onConflict: 'id' });

        if (pErr) {
          console.log('[upsertProfile] upsert error:', pErr.message);
          return { success: false, error: pErr.message };
        }

        console.log('[upsertProfile] success');
        setProfile(prev => prev ? { ...prev, ...data } : null);
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Profile update failed';
        console.log('[upsertProfile] exception:', message);
        return { success: false, error: message };
      }
    },
    [],
  );

  return { session, user, profile, loading, error, signUp, signIn, signOut, upsertProfile };
}
