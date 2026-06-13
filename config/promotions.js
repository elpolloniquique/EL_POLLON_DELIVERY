/**
 * Promociones, banners y secciones destacadas.
 */
window.POLLON_CONFIG = window.POLLON_CONFIG || {};

window.POLLON_CONFIG.promotions = {
  /** Carrusel hero — imágenes del banner principal */
  heroSlides: [
    { src: 'img/porcion de fideo.png', alt: 'Porción de fideo' },
    { src: 'img/chuleta de cerdo.png', alt: 'Chuleta de cerdo' },
    { src: 'img/lomo saltado de pollo con arroz blanco.png', alt: 'Lomo saltado' },
    { src: 'img/oferton sin ensalada.png', alt: 'Oferton sin ensalada' },
    { src: 'img/chaufa brasa.png', alt: 'Chaufa brasa' },
    { src: 'img/bistec a lo pobre.png', alt: 'Bistec a lo pobre' },
    { src: 'img/oferton con fideo.png', alt: 'Oferton con fideo' },
    { src: 'img/pechuga a la plancha.png', alt: 'Pechuga a la plancha' },
    { src: 'img/tallarin saltado de carne.png', alt: 'Tallarín saltado' },
    { src: 'img/oferton mas chaufa.png', alt: 'Oferton mas chaufa' }
  ],

  hero: {
    script: 'Pollo a la brasa',
    title: 'DELIVERY EN IQUIQUE',
    subtitle: 'Combos familiares, ofertas y el mejor sabor peruano — pide en minutos.',
    cta: 'Ver menú y pedir'
  },

  menuBanner: {
    title: 'Realice su pedido ahora mismo'
  },

  menuSection: {
    title: 'Nuestro Menú',
    searchPlaceholder: 'Buscar platos, combos, bebidas...'
  },

  /** Tarjetas promocionales debajo del menú */
  comboCards: [
    {
      image: 'img/oferton mas chaufa.png',
      stickerTop: 'PIDE TU POLLITO',
      stickerBig: 'CON BEBIDA',
      title: 'Todo es mejor en<br />Combo',
      description: 'Disfruta de nuestro delicioso pollito a la brasa con tu bebida preferida. ¡La combinación perfecta para un momento único!',
      cta: 'Pídelo aquí',
      href: '#menu',
      category: 'ofertas-familiares'
    },
    {
      image: 'img/lomo saltado de pollo con arroz blanco.png',
      stickerTop: 'DISFRÚTALO DE',
      stickerBig: 'DIFERENTES<br />MANERAS',
      title: 'Elige tu<br />complemento<br />perfecto',
      description: 'Acompaña tu pollo con el complemento ideal y disfruta de un sabor único en cada bocado. ¡Tu combinación perfecta te espera!',
      cta: 'Ver más',
      href: '#menu',
      category: 'platos-extras'
    }
  ],

  location: {
    title: 'Nuestra Ubicación',
    subtitle: 'Visítanos en nuestro local en el centro de Iquique',
    storeTitle: '🏪 Pollería El Pollón'
  }
};
