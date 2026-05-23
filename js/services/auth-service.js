/**
 * Auth admin — Supabase Auth + tabla administradores + roles
 */
(function () {
  'use strict';

  const SESSION_KEY = 'pollon_admin_profile';
  let currentProfile = null;

  const PERMISSIONS = {
    super_admin: ['*'],
    administrador: ['dashboard', 'products', 'categories', 'orders', 'sales', 'reports', 'settings', 'users'],
    cajero: ['dashboard', 'orders', 'sales', 'tickets'],
    cocina: ['dashboard', 'orders', 'orders_status']
  };

  function can(permission) {
    if (!currentProfile || !currentProfile.activo) return false;
    const rol = currentProfile.rol || 'cajero';
    const list = PERMISSIONS[rol] || [];
    return list.includes('*') || list.includes(permission);
  }

  async function fetchProfile(user) {
    const sb = window.PollonSupabase?.getClient?.();
    if (!sb || !user) return null;
    const { data, error } = await sb
      .from('administradores')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (error) {
      console.warn('[Pollón] administradores:', error.message);
      return null;
    }
    if (data && data.activo) return data;
    return null;
  }

  async function signInAdmin(email, password) {
    const sb = window.PollonSupabase?.getClient?.();
    if (!sb || !window.PollonSupabase?.isConfigured?.()) {
      return legacyLogin(password);
    }
    const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { ok: false, error: error.message };
    const profile = await fetchProfile(data.user);
    if (!profile) {
      await sb.auth.signOut();
      return { ok: false, error: 'Usuario no autorizado como administrador' };
    }
    currentProfile = profile;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    return { ok: true, user: data.user, profile };
  }

  function legacyLogin(password) {
    const legacy = (window.SUPABASE_CONFIG?.legacyAdminPassword || 'HUILLCA123');
    if ((password || '').trim() !== legacy) {
      return Promise.resolve({ ok: false, error: 'Credenciales incorrectas' });
    }
    currentProfile = {
      id: 'legacy',
      email: 'legacy@local',
      nombre: 'Admin Local',
      rol: 'super_admin',
      activo: true
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentProfile));
    return Promise.resolve({ ok: true, profile: currentProfile, legacy: true });
  }

  async function signInAdminPasswordOnly(password) {
    const email = window.SUPABASE_CONFIG?.adminEmail;
    if (email && window.PollonSupabase?.isConfigured?.()) {
      return signInAdmin(email, password);
    }
    return legacyLogin(password);
  }

  async function restoreSession() {
    const sb = window.PollonSupabase?.getClient?.();
    try {
      const cached = sessionStorage.getItem(SESSION_KEY);
      if (cached) {
        currentProfile = JSON.parse(cached);
        if (currentProfile?.id === 'legacy') return currentProfile;
      }
    } catch (_) {}

    if (!sb) return currentProfile;

    const { data: { session } } = await sb.auth.getSession();
    if (!session?.user) return null;
    const profile = await fetchProfile(session.user);
    if (profile) {
      currentProfile = profile;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    }
    return profile;
  }

  async function signOut() {
    currentProfile = null;
    sessionStorage.removeItem(SESSION_KEY);
    const sb = window.PollonSupabase?.getClient?.();
    if (sb) await sb.auth.signOut();
  }

  function getProfile() { return currentProfile; }
  function isAuthenticated() { return !!currentProfile?.activo; }

  function requireAuth(redirectUrl) {
    return restoreSession().then(p => {
      if (!p?.activo) {
        window.location.href = redirectUrl || 'login.html';
        return false;
      }
      return true;
    });
  }

  window.PollonAuth = {
    signInAdmin,
    signInAdminPasswordOnly,
    signOut,
    restoreSession,
    getProfile,
    isAuthenticated,
    can,
    requireAuth,
    PERMISSIONS
  };
})();
