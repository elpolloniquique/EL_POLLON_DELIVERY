import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () =>
  Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('TU_PROYECTO'));

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function getSupabase() {
  if (!supabase) {
    console.warn('[Pollón] Supabase no configurado. Crea .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
  }
  return supabase;
}
