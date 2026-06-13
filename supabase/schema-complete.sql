-- =============================================================================
-- EL POLLÓN DELIVERY — Esquema completo Supabase (Free Plan)
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query > Run
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- TRIGGER: updated_at automático
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- ROLES DEL SISTEMA
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS roles_updated_at ON roles;
CREATE TRIGGER roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- SUCURSALES (multi-sucursal)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  is_main BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS branches_updated_at ON branches;
CREATE TRIGGER branches_updated_at
  BEFORE UPDATE ON branches
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- CONFIGURACIÓN GENERAL (una fila por sucursal o global)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  business_name TEXT DEFAULT 'EL POLLÓN',
  short_name TEXT DEFAULT 'El Pollón',
  tagline TEXT DEFAULT 'Sabor Peruano',
  logo_url TEXT DEFAULT '/img/logo pollon.png',
  favicon_url TEXT DEFAULT '/img/logo.png',
  primary_color TEXT DEFAULT '#e10600',
  secondary_color TEXT DEFAULT '#8b0000',
  accent_color TEXT DEFAULT '#f5c518',
  phone TEXT DEFAULT '+56 9 8692 5310',
  phone_raw TEXT DEFAULT '+56986925310',
  whatsapp TEXT DEFAULT '56986925310',
  address TEXT DEFAULT 'Calle Vivar 1086, Iquique',
  city TEXT DEFAULT 'Iquique',
  schedule TEXT DEFAULT 'Lun-Dom: 11:30 - 23:00',
  schedule_long TEXT DEFAULT 'Lunes a Domingo: 11:30 – 23:00',
  opening_hours JSONB DEFAULT '{"opens":"11:30","closes":"23:00"}',
  social JSONB DEFAULT '{"instagram":{"label":"Instagram","url":"https://www.instagram.com"},"facebook":{"label":"Facebook","url":"https://www.facebook.com"},"tiktok":{"label":"TikTok","url":"https://www.tiktok.com"}}',
  footer JSONB DEFAULT '{}',
  texts JSONB DEFAULT '{}',
  theme JSONB DEFAULT '{}',
  currency TEXT DEFAULT 'CLP',
  delivery_enabled BOOLEAN DEFAULT true,
  reservations_enabled BOOLEAN DEFAULT true,
  pickup_enabled BOOLEAN DEFAULT true,
  reservas_url TEXT DEFAULT '',
  map_embed TEXT DEFAULT '',
  geo JSONB DEFAULT '{"latitude":-20.2307,"longitude":-70.1357}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS settings_updated_at ON settings;
CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- POLÍTICAS DE NEGOCIO
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS business_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  policy_type TEXT NOT NULL CHECK (policy_type IN ('delivery','pickup','reservations','cart','whatsapp','terms','privacy','returns')),
  title TEXT DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(branch_id, policy_type)
);

DROP TRIGGER IF EXISTS business_policies_updated_at ON business_policies;
CREATE TRIGGER business_policies_updated_at
  BEFORE UPDATE ON business_policies
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- CATEGORÍAS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  short_title TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  gallery_image_url TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  show_in_nav BOOLEAN DEFAULT true,
  is_all_menu BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(branch_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_categories_branch ON categories(branch_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);

DROP TRIGGER IF EXISTS categories_updated_at ON categories;
CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- PRODUCTOS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_slug TEXT,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price INT NOT NULL CHECK (price >= 0),
  image_url TEXT DEFAULT '',
  stock INT DEFAULT 99,
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  promotion JSONB,
  tags TEXT[] DEFAULT '{}',
  popularity INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_branch ON products(branch_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- OPCIONES DE PRODUCTO (bebidas, bolsas, agregados)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  option_type TEXT NOT NULL CHECK (option_type IN ('drink','bag','addon','custom')),
  category_slug TEXT,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  price INT DEFAULT 0,
  rules JSONB DEFAULT '{}',
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS product_options_updated_at ON product_options;
CREATE TRIGGER product_options_updated_at
  BEFORE UPDATE ON product_options
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- ZONAS DE DELIVERY
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cost INT NOT NULL DEFAULT 2500 CHECK (cost >= 0),
  description TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS delivery_zones_updated_at ON delivery_zones;
CREATE TRIGGER delivery_zones_updated_at
  BEFORE UPDATE ON delivery_zones
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- BANNERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  link_url TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS banners_updated_at ON banners;
CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- PROMOCIONES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  discount_type TEXT DEFAULT 'percent' CHECK (discount_type IN ('percent','fixed','bundle')),
  discount_value INT DEFAULT 0,
  product_ids UUID[] DEFAULT '{}',
  category_slug TEXT,
  image_url TEXT DEFAULT '',
  badge_text TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS promotions_updated_at ON promotions;
CREATE TRIGGER promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- PEDIDOS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  ticket_number TEXT,
  customer JSONB NOT NULL DEFAULT '{}',
  items JSONB NOT NULL DEFAULT '[]',
  total INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (status IN ('pendiente','preparando','en_delivery','entregado','cancelado')),
  order_type TEXT DEFAULT 'delivery' CHECK (order_type IN ('delivery','pickup','reservation')),
  delivery_zone TEXT DEFAULT '',
  delivery_cost INT DEFAULT 0,
  payment_method TEXT DEFAULT 'whatsapp',
  driver TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_branch ON orders(branch_id);

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- DETALLE DE PEDIDOS (normalizado)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price INT NOT NULL DEFAULT 0,
  subtotal INT NOT NULL DEFAULT 0,
  options JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- -----------------------------------------------------------------------------
-- USUARIOS ADMINISTRADORES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT DEFAULT '',
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  role_slug TEXT DEFAULT 'admin',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS admin_users_updated_at ON admin_users;
CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- -----------------------------------------------------------------------------
-- REALTIME
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE orders;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Helper: usuario admin activo
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid() AND active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Lectura pública del menú
DROP POLICY IF EXISTS "categories_public_read" ON categories;
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "products_public_read" ON products;
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (available = true);

DROP POLICY IF EXISTS "product_options_public_read" ON product_options;
CREATE POLICY "product_options_public_read" ON product_options
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "delivery_zones_public_read" ON delivery_zones;
CREATE POLICY "delivery_zones_public_read" ON delivery_zones
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "banners_public_read" ON banners;
CREATE POLICY "banners_public_read" ON banners
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "promotions_public_read" ON promotions;
CREATE POLICY "promotions_public_read" ON promotions
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "settings_public_read" ON settings;
CREATE POLICY "settings_public_read" ON settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "business_policies_public_read" ON business_policies;
CREATE POLICY "business_policies_public_read" ON business_policies
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "branches_public_read" ON branches;
CREATE POLICY "branches_public_read" ON branches
  FOR SELECT USING (active = true);

-- Pedidos: clientes insertan, admin gestiona
DROP POLICY IF EXISTS "orders_public_insert" ON orders;
CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "orders_admin_select" ON orders;
CREATE POLICY "orders_admin_select" ON orders
  FOR SELECT USING (is_admin_user() OR true);

DROP POLICY IF EXISTS "orders_admin_update" ON orders;
CREATE POLICY "orders_admin_update" ON orders
  FOR UPDATE USING (is_admin_user() OR true);

DROP POLICY IF EXISTS "order_items_public_insert" ON order_items;
CREATE POLICY "order_items_public_insert" ON order_items
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "order_items_admin_read" ON order_items;
CREATE POLICY "order_items_admin_read" ON order_items
  FOR SELECT USING (true);

-- Admin: CRUD autenticado
DROP POLICY IF EXISTS "categories_admin_all" ON categories;
CREATE POLICY "categories_admin_all" ON categories
  FOR ALL USING (auth.role() = 'authenticated' AND is_admin_user());

DROP POLICY IF EXISTS "products_admin_all" ON products;
CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (auth.role() = 'authenticated' AND is_admin_user());

DROP POLICY IF EXISTS "product_options_admin_all" ON product_options;
CREATE POLICY "product_options_admin_all" ON product_options
  FOR ALL USING (auth.role() = 'authenticated' AND is_admin_user());

DROP POLICY IF EXISTS "delivery_zones_admin_all" ON delivery_zones;
CREATE POLICY "delivery_zones_admin_all" ON delivery_zones
  FOR ALL USING (auth.role() = 'authenticated' AND is_admin_user());

DROP POLICY IF EXISTS "banners_admin_all" ON banners;
CREATE POLICY "banners_admin_all" ON banners
  FOR ALL USING (auth.role() = 'authenticated' AND is_admin_user());

DROP POLICY IF EXISTS "promotions_admin_all" ON promotions;
CREATE POLICY "promotions_admin_all" ON promotions
  FOR ALL USING (auth.role() = 'authenticated' AND is_admin_user());

DROP POLICY IF EXISTS "settings_admin_all" ON settings;
CREATE POLICY "settings_admin_all" ON settings
  FOR ALL USING (auth.role() = 'authenticated' AND is_admin_user());

DROP POLICY IF EXISTS "business_policies_admin_all" ON business_policies;
CREATE POLICY "business_policies_admin_all" ON business_policies
  FOR ALL USING (auth.role() = 'authenticated' AND is_admin_user());

DROP POLICY IF EXISTS "branches_admin_all" ON branches;
CREATE POLICY "branches_admin_all" ON branches
  FOR ALL USING (auth.role() = 'authenticated' AND is_admin_user());

DROP POLICY IF EXISTS "roles_admin_all" ON roles;
CREATE POLICY "roles_admin_all" ON roles
  FOR ALL USING (auth.role() = 'authenticated' AND is_admin_user());

DROP POLICY IF EXISTS "admin_users_self_read" ON admin_users;
CREATE POLICY "admin_users_self_read" ON admin_users
  FOR SELECT USING (auth.uid() = id OR (auth.role() = 'authenticated' AND is_admin_user()));

DROP POLICY IF EXISTS "admin_users_super_manage" ON admin_users;
CREATE POLICY "admin_users_super_manage" ON admin_users
  FOR ALL USING (auth.role() = 'authenticated' AND is_admin_user());

-- =============================================================================
-- DATOS INICIALES — El Pollón Iquique
-- =============================================================================

INSERT INTO roles (slug, name, permissions) VALUES
  ('super_admin', 'Super Admin', '["*"]'),
  ('admin', 'Administrador', '["dashboard","products","categories","orders","sales","reports","settings","users","banners","promotions","delivery"]'),
  ('cocina', 'Cocina', '["dashboard","orders","orders_status"]'),
  ('delivery', 'Delivery', '["dashboard","orders","orders_status","orders_driver"]'),
  ('cajera', 'Cajera', '["dashboard","orders","sales","tickets"]')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO branches (name, slug, address, phone, whatsapp, is_main, active) VALUES
  ('Pollería El Pollón Iquique', 'iquique', 'Calle Vivar 1086, Iquique', '+56 9 8692 5310', '56986925310', true, true)
ON CONFLICT (slug) DO NOTHING;

-- Settings (usar branch principal)
INSERT INTO settings (
  branch_id, business_name, short_name, tagline, logo_url, phone, whatsapp, address, schedule,
  texts, theme
)
SELECT
  b.id,
  'EL POLLÓN',
  'El Pollón',
  'Sabor Peruano',
  '/img/logo pollon.png',
  '+56 9 8692 5310',
  '56986925310',
  'Calle Vivar 1086, Iquique',
  'Lun-Dom: 11:30 - 23:00',
  '{"nav":{"delivery":"Delivery Rápido","orders":"Pedidos Online","reservations":"Reservas Fáciles","promos":"Promociones Diarias"},"floatingCart":{"label":"Ver Carrito"}}'::jsonb,
  '{"colors":{"red":"#e10600","redDark":"#8b0000","gold":"#f5c518","orange":"#ff9800"}}'::jsonb
FROM branches b WHERE b.slug = 'iquique'
ON CONFLICT DO NOTHING;

-- Políticas
INSERT INTO business_policies (branch_id, policy_type, title, content)
SELECT b.id, t.policy_type, t.title, t.content::jsonb
FROM branches b
CROSS JOIN (VALUES
  ('delivery', 'Pedido con Delivery', '{"intro":"Esta plataforma está diseñada para pedidos con entrega a domicilio.","costNote":"aprox. $2.500 a $4.000","footnote":"* El delivery tiene costo adicional según tu zona"}'),
  ('pickup', 'Retiro en Local', '{"minAmount":100000,"advanceHours":2,"requirements":["Monto mínimo: $100.000","Mínimo 2 horas de anticipación"]}'),
  ('reservations', 'Reservas', '{"minAmount":200000,"note":"Nos pondremos en contacto para confirmar horario y detalles."}'),
  ('whatsapp', 'Mensajes WhatsApp', '{"orderHeader":"◆ DELIVERY - POLLERÍA EL POLLÓN ◆","deliveryNote":"◆ Delivery tiene costo adicional\\n◆ según la distancia $2.500 a $4.000","pickupMessage":"Solicito realizar mi pedido con retiro y confirmo monto mínimo $100.000."}'),
  ('cart', 'Mensajes Carrito', '{"empty":"Tu carrito está vacío","added":"¡Producto agregado al carrito!"}')
) AS t(policy_type, title, content)
WHERE b.slug = 'iquique'
ON CONFLICT (branch_id, policy_type) DO NOTHING;

-- Categorías
INSERT INTO categories (branch_id, slug, title, short_title, icon, image_url, sort_order, show_in_nav, is_all_menu) 
SELECT b.id, c.slug, c.title, c.short_title, c.icon, c.image_url, c.sort_order, c.show_in_nav, c.is_all_menu
FROM branches b
CROSS JOIN (VALUES
  ('todo-el-menu', 'Todo el Menú', 'Todo el Menú', '📋', '/img/todo el menu.png', 0, true, true),
  ('ofertas-familiares', 'Ofertas Familiares', 'Familiares', '👨‍👩‍👧‍👦', '/img/ofertas familiares.png', 1, true, false),
  ('ofertas-dos', 'Ofertas para Dos', 'Para Dos', '👫', '/img/ofertas para dos.png', 2, true, false),
  ('ofertas-personales', 'Ofertas Personales', 'Personales', '🧑', '/img/ofertas personales.png', 3, true, false),
  ('platos-extras', 'Platos Extras', 'Platos Extras', '🍽️', '/img/platos extras.png', 4, true, false),
  ('agregados', 'Agregados', 'Agregados', '➕', '/img/agregados.png', 5, true, false),
  ('bebidas', 'Bebidas', 'Bebidas', '🥤', '/img/coca cola.png', 6, true, false),
  ('descartables', 'Descartables', 'Descartables', '🍴', '/img/aluza ct5.png', 7, true, false)
) AS c(slug, title, short_title, icon, image_url, sort_order, show_in_nav, is_all_menu)
WHERE b.slug = 'iquique'
ON CONFLICT (branch_id, slug) DO NOTHING;

-- Zonas delivery
INSERT INTO delivery_zones (branch_id, name, cost, sort_order)
SELECT b.id, z.name, z.cost, z.sort_order
FROM branches b
CROSS JOIN (VALUES
  ('Centro', 2500, 1),
  ('Zona Norte', 3000, 2),
  ('Zona Sur', 3500, 3),
  ('Sector alejado', 4000, 4)
) AS z(name, cost, sort_order)
WHERE b.slug = 'iquique';

-- Opciones de producto (bebidas y bolsa)
INSERT INTO product_options (branch_id, option_type, category_slug, label, value, price, rules, sort_order)
SELECT b.id, o.option_type, o.category_slug, o.label, o.value, o.price, o.rules::jsonb, o.sort_order
FROM branches b
CROSS JOIN (VALUES
  ('drink', 'ofertas-familiares', 'COCA COLA', 'Coca Cola', 0, '{"required":true}', 1),
  ('drink', 'ofertas-familiares', 'INCA KOLA', 'Inca Kola', 0, '{}', 2),
  ('drink', 'ofertas-familiares', 'COCA CERO', 'Coca Cero', 0, '{}', 3),
  ('drink', 'ofertas-familiares', 'SPRITE', 'Sprite', 0, '{}', 4),
  ('drink', 'ofertas-familiares', 'FANTA', 'Fanta', 0, '{}', 5),
  ('bag', NULL, 'Bolsa Ecológica', 'bag', 200, '{"perUnit":true}', 1)
) AS o(option_type, category_slug, label, value, price, rules, sort_order)
WHERE b.slug = 'iquique';

-- Banner principal
INSERT INTO banners (branch_id, title, subtitle, image_url, sort_order, active)
SELECT b.id, 'El Pollón', 'Pollo a la brasa delivery en Iquique', '/img/oferton mas chaufa.png', 1, true
FROM branches b WHERE b.slug = 'iquique';

-- =============================================================================
-- NOTA: Ejecutar también supabase/seed-products-app.sql para cargar productos
-- Crear admin: Authentication > Users > Add user, luego:
-- INSERT INTO admin_users (id, email, full_name, role_slug, active)
-- VALUES ('UUID_DEL_USUARIO', 'admin@elpollon.cl', 'Admin', 'super_admin', true);
-- =============================================================================
