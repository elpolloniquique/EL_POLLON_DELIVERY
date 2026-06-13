import { getSupabase } from '@/lib/supabase';
import { ROLE_PERMISSIONS } from '@/lib/constants';

const SESSION_KEY = 'pollon_admin_profile';

export async function signIn(email, password) {
  const sb = getSupabase();
  if (!sb) throw new Error('Configura Supabase en .env');

  const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  if (error) return { ok: false, error: error.message };

  const profile = await fetchAdminProfile(data.user.id);
  if (!profile?.active) {
    await sb.auth.signOut();
    return { ok: false, error: 'Usuario no autorizado como administrador' };
  }

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  return { ok: true, user: data.user, profile };
}

export async function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
  const sb = getSupabase();
  if (sb) await sb.auth.signOut();
}

export async function fetchAdminProfile(userId) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from('admin_users').select('*').eq('id', userId).maybeSingle();
  if (error) {
    console.warn('[Auth]', error.message);
    return null;
  }
  return data;
}

export async function restoreSession() {
  const sb = getSupabase();
  try {
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) return JSON.parse(cached);
  } catch {}

  if (!sb) return null;
  const { data: { session } } = await sb.auth.getSession();
  if (!session?.user) return null;

  const profile = await fetchAdminProfile(session.user.id);
  if (profile?.active) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    return profile;
  }
  return null;
}

export function can(profile, permission) {
  if (!profile?.active) return false;
  const role = profile.role_slug || 'cajera';
  const list = ROLE_PERMISSIONS[role] || [];
  return list.includes('*') || list.includes(permission);
}

export async function fetchAdminUsers() {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb.from('admin_users').select('*').order('created_at');
  return data || [];
}

export async function updateAdminUser(id, payload) {
  const sb = getSupabase();
  const { data, error } = await sb.from('admin_users').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
