/**
 * Utilidades compartidas — El Pollón
 */
window.PollonUtils = (function () {
  'use strict';

  const CURRENCY = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });

  function money(v) {
    return CURRENCY.format(Number(v) || 0);
  }

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function formatDateTime(iso) {
    if (!iso) return '-';
    try {
      return new Date(iso).toLocaleString('es-CL');
    } catch (_) {
      return iso;
    }
  }

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function toast(msg, ms) {
    const t = document.createElement('div');
    t.className = 'pollon-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), ms || 3200);
  }

  const ESTADO_MAP_TO_LEGACY = {
    pendiente: 'Pendiente',
    confirmado: 'En preparación',
    preparando: 'En preparación',
    listo: 'En preparación',
    en_delivery: 'En preparación',
    entregado: 'Entregado',
    cancelado: 'Cancelado'
  };

  const ESTADO_MAP_FROM_LEGACY = {
    Pendiente: 'pendiente',
    'En preparación': 'preparando',
    Entregado: 'entregado',
    Cancelado: 'cancelado'
  };

  function estadoToLegacy(db) {
    return ESTADO_MAP_TO_LEGACY[db] || db || 'Pendiente';
  }

  function estadoFromLegacy(legacy) {
    return ESTADO_MAP_FROM_LEGACY[legacy] || 'pendiente';
  }

  function nextEstado(current) {
    const flow = ['pendiente', 'confirmado', 'preparando', 'listo', 'en_delivery', 'entregado', 'cancelado'];
    const cur = estadoFromLegacy(current) || current || 'pendiente';
    const idx = flow.indexOf(cur);
    return flow[(idx + 1) % flow.length];
  }

  return {
    money,
    todayISO,
    formatDateTime,
    slugify,
    toast,
    estadoToLegacy,
    estadoFromLegacy,
    nextEstado,
    BAG_PRICE: 200
  };
})();
