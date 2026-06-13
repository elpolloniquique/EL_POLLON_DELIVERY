export const fallbackCategories = [
  { id: '1', slug: 'todo-el-menu', title: 'Todo el Menú', short_title: 'Todo', icon: '📋', image_url: '/img/todo el menu.png', sort_order: 0, show_in_nav: true, is_all_menu: true, active: true },
  { id: '2', slug: 'ofertas-familiares', title: 'Ofertas Familiares', short_title: 'Familiares', icon: '👨‍👩‍👧‍👦', image_url: '/img/ofertas familiares.png', sort_order: 1, show_in_nav: true, active: true },
  { id: '3', slug: 'ofertas-dos', title: 'Ofertas para Dos', short_title: 'Para Dos', icon: '👫', image_url: '/img/ofertas para dos.png', sort_order: 2, show_in_nav: true, active: true },
  { id: '4', slug: 'ofertas-personales', title: 'Ofertas Personales', short_title: 'Personales', icon: '🧑', image_url: '/img/ofertas personales.png', sort_order: 3, show_in_nav: true, active: true },
  { id: '5', slug: 'platos-extras', title: 'Platos Extras', short_title: 'Extras', icon: '🍽️', image_url: '/img/platos extras.png', sort_order: 4, show_in_nav: true, active: true },
  { id: '6', slug: 'agregados', title: 'Agregados', short_title: 'Agregados', icon: '➕', image_url: '/img/agregados.png', sort_order: 5, show_in_nav: true, active: true },
  { id: '7', slug: 'bebidas', title: 'Bebidas', short_title: 'Bebidas', icon: '🥤', image_url: '/img/coca cola.png', sort_order: 6, show_in_nav: true, active: true },
  { id: '8', slug: 'descartables', title: 'Descartables', short_title: 'Descartables', icon: '🍴', image_url: '/img/aluza ct5.png', sort_order: 7, show_in_nav: true, active: true },
];

export const fallbackProducts = [
  { id: 'p1', category_slug: 'ofertas-familiares', name: 'Oferton mas chaufa', description: 'Pollo entero, papas fritas, arroz chaufa, ensalada y bebidas 1.5lt.', price: 25500, image_url: '/img/ofertas familiares.png', available: true },
  { id: 'p2', category_slug: 'ofertas-familiares', name: 'oferton familiar', description: 'Pollo entero, papas fritas, ensalada y bebidas 1.5lt', price: 23500, image_url: '/img/oferton familiar.png', available: true },
  { id: 'p3', category_slug: 'ofertas-dos', name: '1/2 combo', description: 'Medio pollo, papas fritas, ensalada personal', price: 15600, image_url: '/img/medio combo.png', available: true },
  { id: 'p4', category_slug: 'ofertas-personales', name: '1/4 combo', description: '1/4 pollo, papas fritas personales, ensalada personal', price: 8400, image_url: '/img/personal combo.png', available: true },
  { id: 'p5', category_slug: 'platos-extras', name: 'Salchipapas', description: '', price: 7000, image_url: '/img/salchipapa.png', available: true },
  { id: 'p6', category_slug: 'agregados', name: 'Porcion de papas fritas familiar', description: 'Porción grande de papas crujientes', price: 9500, image_url: '/img/porcion de papa.png', available: true },
  { id: 'p7', category_slug: 'bebidas', name: 'Coca Cola', description: 'Bebida 1.5L', price: 4000, image_url: '/img/coca cola.png', available: true },
  { id: 'p8', category_slug: 'descartables', name: 'Bolsa ecológica', description: 'Bolsa ecológica unidad', price: 200, image_url: '/img/bolsa ecologica.png', available: true },
];

export const fallbackBanners = [
  { id: 'b1', title: 'El Pollón', subtitle: 'Pollo a la brasa delivery en Iquique', image_url: '/img/oferton mas chaufa.png', active: true },
];

export const fallbackZones = [
  { id: 'z1', name: 'Centro', cost: 2500 },
  { id: 'z2', name: 'Zona Norte', cost: 3000 },
  { id: 'z3', name: 'Zona Sur', cost: 3500 },
  { id: 'z4', name: 'Sector alejado', cost: 4000 },
];

export const fallbackOptions = [
  { option_type: 'drink', category_slug: 'ofertas-familiares', label: 'COCA COLA', value: 'Coca Cola', price: 0, rules: { required: true } },
  { option_type: 'drink', category_slug: 'ofertas-familiares', label: 'INCA KOLA', value: 'Inca Kola', price: 0 },
  { option_type: 'drink', category_slug: 'ofertas-familiares', label: 'SPRITE', value: 'Sprite', price: 0 },
  { option_type: 'bag', label: 'Bolsa Ecológica', value: 'bag', price: 200, rules: { perUnit: true } },
];

export const BAG_RULES = {
  'ofertas-familiares': { required: true, perUnit: true },
  'ofertas-dos': { required: true, perUnit: false },
  'ofertas-personales': { required: true, perUnit: false },
  'platos-extras': { required: true, perUnit: false },
  agregados: { required: false, perUnit: false },
  bebidas: { hidden: true },
  descartables: { hidden: true },
};

export const DRINK_REQUIRED = ['ofertas-familiares'];
