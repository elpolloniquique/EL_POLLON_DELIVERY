/**
 * Cliente Supabase singleton
 */
(function () {
  'use strict';

  let client = null;
  let configured = false;

  function isConfigured() {
    const c = window.SUPABASE_CONFIG || {};
    return !!(c.url && c.anonKey &&
      c.url !== 'TU_SUPABASE_URL' &&
      c.anonKey !== 'TU_SUPABASE_ANON_KEY');
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (client) return client;
    if (typeof supabase === 'undefined' || !supabase.createClient) {
      console.warn('[Pollón] SDK Supabase no cargado.');
      return null;
    }
    const cfg = window.SUPABASE_CONFIG;
    client = supabase.createClient(cfg.url, cfg.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      realtime: { params: { eventsPerSecond: 10 } }
    });
    configured = true;
    return client;
  }

  window.PollonSupabase = {
    getClient,
    isConfigured,
    isReady: function () { return configured && !!client; }
  };
})();
