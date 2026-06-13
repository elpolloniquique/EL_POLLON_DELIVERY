export const ORDER_STATUSES = ['pendiente', 'preparando', 'en_delivery', 'entregado', 'cancelado'];

export const ORDER_STATUS_LABELS = {
  pendiente: 'Pendiente',
  preparando: 'En preparación',
  en_delivery: 'En camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export const ROLE_PERMISSIONS = {
  super_admin: ['*'],
  admin: ['dashboard', 'products', 'categories', 'orders', 'sales', 'reports', 'settings', 'users', 'banners', 'promotions', 'delivery'],
  cocina: ['dashboard', 'orders', 'orders_status'],
  delivery: ['dashboard', 'orders', 'orders_status', 'orders_driver'],
  cajera: ['dashboard', 'orders', 'sales', 'tickets'],
};

export const DRIVERS = ['Eduardo', 'Antony', 'Mauriflax', 'JDN'];

export const DEFAULT_THEME = {
  colors: {
    red: '#e10600',
    redDark: '#8b0000',
    gold: '#f5c518',
    orange: '#ff9800',
  },
};

export const FALLBACK_SETTINGS = {
  business_name: 'EL POLLÓN',
  short_name: 'El Pollón',
  tagline: 'Sabor Peruano',
  logo_url: '/img/logo pollon.png',
  phone: '+56 9 8692 5310',
  whatsapp: '56986925310',
  address: 'Calle Vivar 1086, Iquique',
  schedule: 'Lun-Dom: 11:30 - 23:00',
  primary_color: '#e10600',
  secondary_color: '#8b0000',
  accent_color: '#f5c518',
};
