/** Reexport productos desde config — respaldo si Supabase no está configurado */
window.POLLON_FALLBACK_PRODUCTS = window.POLLON_CONFIG?.products
  ? JSON.parse(JSON.stringify(window.POLLON_CONFIG.products))
  : {};
