-- =============================================================================
-- El Pollón — Esquema Supabase (PostgreSQL)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_slug TEXT NOT NULL REFERENCES categories(slug) ON UPDATE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price INT NOT NULL CHECK (price >= 0),
  image_url TEXT DEFAULT '',
  stock INT DEFAULT 99,
  available BOOLEAN DEFAULT true,
  promotion JSONB,
  tags TEXT[] DEFAULT '{}',
  popularity INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);

-- Pedidos (compatible con estructura Firebase anterior)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ticket_number TEXT,
  customer JSONB NOT NULL DEFAULT '{}',
  items JSONB NOT NULL DEFAULT '[]',
  total INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pendiente',
  delivered_at TIMESTAMPTZ,
  order_type TEXT DEFAULT 'delivery',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Perfiles admin (vinculado a auth.users)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- =============================================================================
-- Row Level Security
-- =============================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Lectura pública del menú
DROP POLICY IF EXISTS "categories_public_read" ON categories;
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "products_public_read" ON products;
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (available = true);

-- Pedidos: insertar desde la web (clientes)
DROP POLICY IF EXISTS "orders_public_insert" ON orders;
CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (true);

-- Pedidos: lectura y actualización (panel admin — ajustar en producción)
DROP POLICY IF EXISTS "orders_public_select" ON orders;
CREATE POLICY "orders_public_select" ON orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "orders_public_update" ON orders;
CREATE POLICY "orders_public_update" ON orders
  FOR UPDATE USING (true);

-- Admin: solo usuarios autenticados gestionan productos
DROP POLICY IF EXISTS "products_admin_all" ON products;
CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "categories_admin_all" ON categories;
CREATE POLICY "categories_admin_all" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Storage bucket (ejecutar también storage.sql)
-- INSERT en categories por defecto
INSERT INTO categories (slug, title, icon, sort_order) VALUES
  ('ofertas-familiares', 'Ofertas Familiares', '👨‍👩‍👧‍👦', 1),
  ('ofertas-dos', 'Ofertas para Dos', '👫', 2),
  ('ofertas-personales', 'Ofertas Personales', '🧑', 3),
  ('platos-extras', 'Platos Extras', '🍽️', 4),
  ('agregados', 'Agregados', '➕', 5),
  ('bebidas', 'Bebidas', '🥤', 6),
  ('descartables', 'Descartables', '🍴', 7)
ON CONFLICT (slug) DO NOTHING;
