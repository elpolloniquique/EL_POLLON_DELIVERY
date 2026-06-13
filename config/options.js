/**
 * Opciones personalizables — Bebidas, bolsas ecológicas y reglas por categoría.
 */
window.POLLON_CONFIG = window.POLLON_CONFIG || {};

window.POLLON_CONFIG.options = {
  bagPrice: 200,
  bagLabel: 'Bolsa Ecológica',

  /** Categorías que requieren elegir bebida al agregar */
  drinkRequiredCategories: ['ofertas-familiares'],

  /** Categorías sin opción de bolsa */
  noBagCategories: ['bebidas', 'descartables'],

  drinks: [
    { value: 'Coca Cola', label: 'COCA COLA' },
    { value: 'Inca Kola', label: 'INCA KOLA' },
    { value: 'Coca Cero', label: 'COCA CERO' },
    { value: 'Sprite', label: 'SPRITE' },
    { value: 'Fanta', label: 'FANTA', fullWidth: true }
  ],

  /**
   * Reglas de bolsa por categoría:
   * - required: obligatorio elegir
   * - perUnit: 1 bolsa por cada unidad del producto
   * - optional: puede elegir agregar o no
   * - hidden: no mostrar sección de bolsa
   */
  bagRules: {
    'ofertas-familiares': { required: true, perUnit: true, note: 'familiares' },
    'ofertas-dos': { required: true, perUnit: false, note: 'standard' },
    'ofertas-personales': { required: true, perUnit: false, note: 'standard' },
    'platos-extras': { required: true, perUnit: false, note: 'standard' },
    'agregados': { required: false, perUnit: false, note: 'optional' },
    'bebidas': { hidden: true },
    'descartables': { hidden: true }
  },

  modal: {
    title: 'Personaliza tu pedido',
    drinkTitle: 'BEBIDAS —',
    drinkSubtitle: 'elija su sabor',
    drinkRequired: 'Obligatorio',
    bagTitle: 'BOLSA ECOLÓGICA',
    quantityLabel: 'Cantidad:',
    totalLabel: 'Total:',
    cancelBtn: 'Cancelar',
    confirmBtn: 'Agregar al Carrito',
    addBagLabel: 'Agregar bolsa',
    noBagLabel: 'Sin bolsa'
  }
};
