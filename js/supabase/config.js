/**
 * Configuración Supabase — El Pollón
 * 1. Crea un proyecto en https://supabase.com
 * 2. Copia URL y anon key desde Settings > API
 * 3. Ejecuta supabase/schema.sql y supabase/seed-products.sql en el SQL Editor
 */
window.SUPABASE_CONFIG = {
  url: 'TU_SUPABASE_URL',
  anonKey: 'TU_SUPABASE_ANON_KEY',
  /** Email del usuario admin creado en Supabase Auth (opcional) */
  adminEmail: 'admin@elpollon.cl',
  /** Contraseña local de respaldo si Supabase no está configurado */
  legacyAdminPassword: 'HUILLCA123',
  storageBucket: 'product-images'
};
