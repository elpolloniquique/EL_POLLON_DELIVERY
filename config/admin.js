/**
 * Configuración del panel administrativo — Textos, estados y métricas.
 */
window.POLLON_CONFIG = window.POLLON_CONFIG || {};

window.POLLON_CONFIG.admin = {
  panel: {
    title: 'Panel de Administración',
    subtitle: 'Gestión de pedidos recibidos desde la carta digital y WhatsApp.',
    closeBtn: 'Cerrar panel',
    darkModeOn: '🌙 Modo oscuro',
    darkModeOff: '☀️ Modo claro'
  },

  statuses: ['Pendiente', 'En preparación', 'Entregado', 'Cancelado'],

  stats: {
    total: 'Total pedidos',
    today: 'Pedidos hoy',
    salesToday: 'Ventas hoy',
    pending: 'Pendientes',
    deliveredPct: '% pedidos entregados',
    avgTicket: 'Ticket promedio',
    avgDeliveryTime: 'Tiempo prom. entrega'
  },

  filters: {
    from: 'Desde',
    to: 'Hasta',
    status: 'Estado',
    search: 'Buscar (nombre / teléfono)',
    searchPlaceholder: 'Ej: Juan, +569...',
    countLabel: 'Pedidos en el rango seleccionado:',
    all: 'Todos',
    alarmOn: '🔔 Alarma activa',
    alarmOff: '🔕 Activar alarma',
    copy: '📋 Copiar pedidos (Excel)',
    refresh: '🔃 Actualizar',
    clear: '✖ Limpiar filtros'
  },

  table: {
    id: 'ID',
    client: 'Cliente',
    phone: 'Teléfono',
    total: 'Total',
    status: 'Estado',
    datetime: 'Fecha/Hora',
    actions: 'Acciones',
    empty: 'No hay pedidos con los filtros actuales.',
    view: 'Ver',
    statusBtn: 'Estado',
    whatsapp: 'WhatsApp',
    print: '🖨️ Imprimir'
  },

  alarm: { src: 'sounds/alarma.mp3', durationMs: 2000 }
};
