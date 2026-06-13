/**
 * Configuración remota — Fusiona Supabase (configuracion_tienda + categorias)
 * con los archivos estáticos config/*.js
 */
(function () {
  'use strict';

  function ensureConfig() {
    window.POLLON_CONFIG = window.POLLON_CONFIG || {};
    return window.POLLON_CONFIG;
  }

  /** Normaliza teléfono chileno para enlaces wa.me / tel: */
  function normalizePhoneDigits(phone) {
    return String(phone || '').replace(/\D/g, '');
  }

  /** Fusiona fila configuracion_tienda sobre POLLON_CONFIG */
  function mergeStoreRow(row) {
    if (!row) return;
    const cfg = ensureConfig();
    cfg.business = cfg.business || {};
    cfg.whatsapp = cfg.whatsapp || {};
    cfg.delivery = cfg.delivery || {};

    if (row.nombre_tienda) {
      cfg.business.shortName = row.nombre_tienda;
      cfg.business.legalName = row.nombre_tienda;
      if (!cfg.business.name || cfg.business.name === 'EL POLLÓN') {
        cfg.business.name = row.nombre_tienda.toUpperCase();
      }
    }
    if (row.telefono) {
      const digits = normalizePhoneDigits(row.telefono);
      cfg.business.phone = row.telefono;
      cfg.business.phoneRaw = digits.startsWith('56') ? '+' + digits : row.telefono;
      cfg.business.phoneLink = 'tel:+' + (digits.startsWith('56') ? digits : '56' + digits.replace(/^0/, ''));
    }
    if (row.direccion) {
      cfg.business.address = row.direccion;
      cfg.business.addressFull = row.direccion.includes('Chile') ? row.direccion : row.direccion + ', Chile';
    }
    if (row.horario) {
      cfg.business.schedule = row.horario;
      cfg.business.scheduleLong = row.horario;
    }
    if (row.whatsapp) {
      cfg.whatsapp.ordersNumber = normalizePhoneDigits(row.whatsapp);
    }
    if (row.mensaje_cliente) {
      cfg.whatsapp.pickupMessage = cfg.whatsapp.pickupMessage || row.mensaje_cliente;
    }
    if (row.delivery_activo !== undefined && row.delivery_activo !== null) {
      cfg.delivery.enabled = !!row.delivery_activo;
    }
    if (row.reservas_activas !== undefined && row.reservas_activas !== null) {
      cfg.delivery.reservations = cfg.delivery.reservations || {};
      cfg.delivery.reservations.enabled = !!row.reservas_activas;
    }
  }

  /** Fusiona categorías de Supabase con las del archivo config */
  function mergeCategoriesRows(rows) {
    if (!rows?.length) return;
    const cfg = ensureConfig();
    const existing = cfg.categories || [];
    const todoMenu = existing.find(c => c.isAllMenu) || {
      id: 'todo-el-menu',
      label: 'Todo el Menú',
      shortLabel: 'Todo el Menú',
      emoji: '📋',
      image: 'img/todo el menu.png',
      showInNav: true,
      isAllMenu: true
    };

    const merged = [todoMenu];
    rows.forEach(row => {
      const prev = existing.find(c => c.id === row.slug);
      merged.push({
        id: row.slug,
        label: row.nombre || prev?.label || row.slug,
        shortLabel: prev?.shortLabel || row.nombre || row.slug,
        emoji: prev?.emoji || '🍗',
        image: row.imagen_url || prev?.image || '',
        galleryImage: prev?.galleryImage || row.imagen_url || prev?.image || '',
        showInNav: row.activo !== false,
        supabaseId: row.id
      });
    });

    cfg.categories = merged;
    cfg.categoryOrder = merged.filter(c => !c.isAllMenu).map(c => c.id);
  }

  /** Ajusta orden de categorías según productos cargados */
  function syncCategoryOrderFromProducts(catalog) {
    if (!catalog || typeof catalog !== 'object') return;
    const cfg = ensureConfig();
    const keysWithProducts = Object.keys(catalog).filter(k => (catalog[k] || []).length > 0);
    if (!keysWithProducts.length) return;

    const baseOrder = cfg.categoryOrder || [];
    const ordered = baseOrder.filter(k => keysWithProducts.includes(k));
    const extra = keysWithProducts.filter(k => !ordered.includes(k));
    cfg.categoryOrder = [...ordered, ...extra];
  }

  /** Persiste configuración del panel admin hacia Supabase */
  async function saveStoreRow(payload) {
    const sb = window.PollonSupabase?.getClient?.();
    if (!sb) throw new Error('Supabase no configurado');
    const row = {
      id: 1,
      nombre_tienda: payload.nombre_tienda,
      telefono: payload.telefono,
      whatsapp: payload.whatsapp,
      direccion: payload.direccion,
      horario: payload.horario,
      mensaje_cliente: payload.mensaje_cliente,
      delivery_activo: payload.delivery_activo,
      reservas_activas: payload.reservas_activas
    };
    const { error } = await sb.from('configuracion_tienda').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    mergeStoreRow(row);
    return row;
  }

  async function load() {
    const sb = window.PollonSupabase?.getClient?.();
    if (!sb || !window.PollonSupabase?.isConfigured?.()) {
      return { ok: false, source: 'files' };
    }

    try {
      const [storeRes, catRes] = await Promise.all([
        sb.from('configuracion_tienda').select('*').eq('id', 1).maybeSingle(),
        sb.from('categorias').select('id, slug, nombre, imagen_url, orden, activo').eq('activo', true).order('orden', { ascending: true })
      ]);

      if (storeRes.error) console.warn('[Pollón] configuracion_tienda:', storeRes.error.message);
      if (catRes.error) console.warn('[Pollón] categorias:', catRes.error.message);

      if (storeRes.data) mergeStoreRow(storeRes.data);
      if (catRes.data?.length) mergeCategoriesRows(catRes.data);

      return {
        ok: true,
        source: 'supabase',
        store: storeRes.data,
        categories: catRes.data || []
      };
    } catch (e) {
      console.warn('[Pollón] Config remota:', e.message || e);
      return { ok: false, source: 'files', error: e };
    }
  }

  function getSnapshot() {
    return JSON.parse(JSON.stringify(ensureConfig()));
  }

  window.PollonStoreConfig = {
    load,
    mergeStoreRow,
    mergeCategoriesRows,
    syncCategoryOrderFromProducts,
    saveStoreRow,
    getSnapshot
  };
})();
