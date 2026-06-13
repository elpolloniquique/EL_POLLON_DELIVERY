-- =============================================================================
-- CREAR ADMINISTRADOR — App React El Pollón
-- Ejecutar DESPUÉS de schema-complete.sql y de crear usuario en Authentication
-- =============================================================================

-- PASO 1: Ve a Supabase → Authentication → Users → Add user
-- PASO 2: Crea usuario con tu email y contraseña
-- PASO 3: Cambia el email abajo por el tuyo y ejecuta este SQL

INSERT INTO admin_users (id, email, full_name, role_slug, active)
SELECT id, email, 'Administrador El Pollón', 'super_admin', true
FROM auth.users
WHERE email = 'tutacanehuillca@gmail.com'   -- ← CAMBIA ESTO por tu correo real
ON CONFLICT (id) DO UPDATE
  SET active = true, role_slug = 'super_admin', full_name = 'Administrador El Pollón';

-- Verificar que funcionó:
-- Table Editor → admin_users → debe aparecer 1 fila con tu email
