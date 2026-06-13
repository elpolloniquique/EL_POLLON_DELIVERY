/**
 * Configuración general del negocio — Edita aquí datos de contacto, logo y horarios.
 */
window.POLLON_CONFIG = window.POLLON_CONFIG || {};

window.POLLON_CONFIG.business = {
  name: 'EL POLLÓN',
  shortName: 'El Pollón',
  tagline: 'Sabor Peruano',
  legalName: 'Pollería El Pollón',
  logo: 'img/logo pollon.png',
  favicon: 'img/logo.png',
  phone: '+56 9 8692 5310',
  phoneRaw: '+56986925310',
  phoneLink: 'tel:+56986925310',
  address: 'Calle Vivar 1086, Iquique',
  addressFull: 'Calle Vivar 1086, Iquique, Chile',
  city: 'Iquique',
  region: 'Tarapacá',
  country: 'Chile',
  schedule: 'Lun-Dom: 11:30 - 23:00',
  scheduleLong: 'Lunes a Domingo: 11:30 – 23:00',
  openingHours: { opens: '11:30', closes: '23:00' },
  geo: { latitude: -20.2307, longitude: -70.1357 },
  mapEmbed: 'https://www.google.com/maps?q=Calle+Vivar+1086,+Iquique,+Chile&hl=es&z=18&t=k&output=embed',
  siteUrl: 'https://elpolloniquique.github.io/EL_POLLON_DELIVERY/',
  loginUrl: 'login.html',
  adminUrl: 'login.html',
  reservasUrl: 'https://pollon543.github.io/reservas-online-pollon-de-iquique/',
  currency: 'CLP',
  priceRange: '$$',
  cuisine: ['Peruana', 'Pollo a la brasa'],
  social: {
    instagram: { label: 'Instagram', url: 'https://www.instagram.com' },
    facebook: { label: 'Facebook', url: 'https://www.facebook.com' },
    tiktok: { label: 'TikTok', url: 'https://www.tiktok.com' }
  },
  footer: {
    copyright: '© 2025 Pollería El Pollón - Iquique, Chile. Todos los derechos reservados.',
    credit: 'Desarrollado con ❤️ para los amantes del buen pollo a la brasa',
    subtitle: '📍 Iquique, Chile · Pollo a la brasa & comida peruana',
    links: {
      locales: { label: 'Locales', href: '#ubicacion' },
      contacto: { label: 'Contacto', href: 'tel:+56986925310' },
      cambios: { label: 'Políticas de cambio', href: '#' },
      terminos: { label: 'Términos y condiciones', href: '#' },
      privacidad: { label: 'Política de privacidad', href: '#' },
      delivery: { label: 'Zonas y delivery', href: '#modal-delivery' }
    }
  }
};
