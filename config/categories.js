/**
 * Categorías del menú — Orden, imágenes, iconos y reglas de visualización.
 */
window.POLLON_CONFIG = window.POLLON_CONFIG || {};

window.POLLON_CONFIG.categories = [
  {
    id: 'todo-el-menu',
    label: 'Todo el Menú',
    shortLabel: 'Todo el Menú',
    emoji: '📋',
    image: 'img/todo el menu.png',
    showInNav: true,
    isAllMenu: true
  },
  {
    id: 'ofertas-familiares',
    label: 'Ofertas Familiares',
    shortLabel: 'Familiares',
    emoji: '👨‍👩‍👧‍👦',
    image: 'img/ofertas familiares.png',
    galleryImage: 'img/oferton mas chaufa.png',
    showInNav: true
  },
  {
    id: 'ofertas-dos',
    label: 'Ofertas para Dos',
    shortLabel: 'Para Dos',
    emoji: '👫',
    image: 'img/ofertas para dos.png',
    galleryImage: 'img/medio combo.png',
    showInNav: true
  },
  {
    id: 'ofertas-personales',
    label: 'Ofertas Personales',
    shortLabel: 'Personales',
    emoji: '🧑',
    image: 'img/ofertas personales.png',
    galleryImage: 'img/personal combo.png',
    showInNav: true
  },
  {
    id: 'platos-extras',
    label: 'Platos Extras',
    shortLabel: 'Platos Extras',
    emoji: '🍽️',
    image: 'img/platos extras.png',
    galleryImage: 'img/lomo saltado con chaufa.png',
    showInNav: true
  },
  {
    id: 'agregados',
    label: 'Agregados',
    shortLabel: 'Agregados',
    emoji: '➕',
    image: 'img/agregados.png',
    galleryImage: 'img/porcion de papa.png',
    showInNav: true
  },
  {
    id: 'bebidas',
    label: 'Bebidas',
    shortLabel: 'Bebidas',
    emoji: '🥤',
    image: 'img/coca cola.png',
    galleryImage: 'img/bebida_cocacola.png',
    showInNav: true
  },
  {
    id: 'descartables',
    label: 'Descartables',
    shortLabel: 'Descartables',
    emoji: '🍴',
    image: 'img/aluza ct5.png',
    galleryImage: 'img/desc_ct5.png',
    showInNav: true
  }
];

/** Categorías de producto (sin "todo el menú") en orden de render */
window.POLLON_CONFIG.categoryOrder = window.POLLON_CONFIG.categories
  .filter(c => !c.isAllMenu)
  .map(c => c.id);
