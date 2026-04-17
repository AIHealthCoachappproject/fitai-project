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

// Columns that live on public.users (per CLAUDE.md ACTUAL schema)
const USERS_COLS = ['name', 'goal', 'weight', 'plan', 'onboarding_completed'] as const;
// Columns that live on public.user_profiles
const PROFILES_COLS = [
  'name', 'goal', 'plan', 'onboarding_completed',
  'age', 'height_cm', 'gender', 'activity_level', 'daily_calorie', 'bmr',
] as const;

function pick<T extends Record<string, unknown>>(obj: T, keys: readonly string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of keys) if (k in obj) out[k] = obj[k];
  return out;
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

      const [usersRes, profileRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', userId).maybeSingle(),
        supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle(),
      ]);

      if (usersRes.error && usersRes.error.code !== 'PGRST116') {
        console.error('FETCH USERS ERROR:', usersRes.error.message);
      }
      if (profileRes.error && profileRes.error.code !== 'PGRST116') {
        console.error('FETCH USER_PROFILES ERROR:', profileRes.error.message);
      }

      const u = usersRes.data ?? {};
      const p = profileRes.data ?? {};

      setProfile({
        id: userId,
        email,
        created_at: u.created_at ?? authUser?.created_at ?? '',
        // From users table
        name: u.name ?? p.name ?? '',
        goal: u.goal ?? p.goal ?? '',
        weight: u.weight ?? 0,
        plan: u.plan ?? p.plan ?? 'free',
        onboarding_completed: u.onboarding_completed ?? p.onboarding_completed ?? false,
        // From user_profiles
        age: p.age ?? 0,
        height_cm: p.height_cm ?? 0,
        gender: p.gender ?? '',
        activity_level: p.activity_level ?? '',
        daily_calorie: p.daily_calorie ?? 0,
        bmr: p.bmr ?? 0,
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
          const msg = 'Too many signup attempts. Please wait a minute and try again, or log in with an existing account.';
          setError(msg);
          return { success: false, error: msg };
        }
        setError(signUpError.message);
        return { success: false, error: signUpError.message };
      }

      if (!data.user) return { success: false, error: 'Registration failed — no user returned' };

      // Seed rows in users + user_profiles so later upserts work
      const [usersIns, profilesIns] = await Promise.all([
        supabase.from('users').upsert(
          { id: data.user.id, email: data.user.email ?? email, onboarding_completed: false },
          { onConflict: 'id' },
        ),
        supabase.from('user_profiles').upsert(
          { id: data.user.id, onboarding_completed: false },
          { onConflict: 'id' },
        ),
      ]);
      if (usersIns.error)    console.error('USERS INIT ERROR:', usersIns.error.message);
      if (profilesIns.error) console.error('USER_PROFILES INIT ERROR:', profilesIns.error.message);

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
      if (!user) return { success: false, error: 'Not authenticated' };

      try {
        const usersPatch    = pick(data as Record<string, unknown>, USERS_COLS as unknown as string[]);
        const profilesPatch = pick(data as Record<string, unknown>, PROFILES_COLS as unknown as string[]);

        if (Object.keys(usersPatch).length) {
          const { error: uErr } = await supabase
            .from('users')
            .upsert({ id: user.id, ...usersPatch }, { onConflict: 'id' });
          if (uErr) {
            console.error('USERS UPSERT ERROR:', uErr.message);
            return { success: false, error: uErr.message };
          }
        }

        if (Object.keys(profilesPatch).length) {
          const { error: pErr } = await supabase
            .from('user_profiles')
            .upsert({ id: user.id, ...profilesPatch }, { onConflict: 'id' });
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

  return { session, user, profile, loading, error, signUp, signIn, signOut, upsertProfile };
}
