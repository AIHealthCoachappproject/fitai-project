import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Safety wrapper: if AsyncStorage native module fails, fall back to in-memory storage
const SafeStorage = {
  _fallback: new Map<string, string>(),
  _useFallback: false,

  async getItem(key: string): Promise<string | null> {
    try {
      if (this._useFallback) return this._fallback.get(key) ?? null;
      return await AsyncStorage.getItem(key);
    } catch {
      console.warn('[Supabase] AsyncStorage.getItem failed, using memory fallback');
      this._useFallback = true;
      return this._fallback.get(key) ?? null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (this._useFallback) { this._fallback.set(key, value); return; }
      await AsyncStorage.setItem(key, value);
    } catch {
      console.warn('[Supabase] AsyncStorage.setItem failed, using memory fallback');
      this._useFallback = true;
      this._fallback.set(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (this._useFallback) { this._fallback.delete(key); return; }
      await AsyncStorage.removeItem(key);
    } catch {
      console.warn('[Supabase] AsyncStorage.removeItem failed, using memory fallback');
      this._useFallback = true;
      this._fallback.delete(key);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SafeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
