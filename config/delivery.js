/**
 * Configuración de delivery — Costos, zonas y políticas de envío.
 */
window.POLLON_CONFIG = window.POLLON_CONFIG || {};

window.POLLON_CONFIG.delivery = {
  enabled: true,
  costMin: 2500,
  costMax: 4000,
  costNote: 'aprox. $2.500 a $4.000',
  areaServed: 'Iquique',
  zones: [
    { name: 'Centro', cost: 2500 },
    { name: 'Zona Norte', cost: 3000 },
    { name: 'Zona Sur', cost: 3500 },
    { name: 'Sector alejado', cost: 4000 }
  ],
  pickup: {
    minAmount: 100000,
    advanceHours: 2,
    note: 'Este canal es exclusivo para pedidos grandes con retiro en local.'
  },
  reservations: {
    minAmount: 200000,
    note: 'Una vez enviada tu solicitud, nos pondremos en contacto para confirmar el horario y los detalles de tu reserva.'
  }
};
