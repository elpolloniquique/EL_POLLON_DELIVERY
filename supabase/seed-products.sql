-- Seed de productos desde menú local
-- Ejecutar DESPUÉS de schema.sql
-- Generado desde js/products-fallback.js

-- Limpiar productos previos (opcional en desarrollo)
-- TRUNCATE products RESTART IDENTITY CASCADE;

-- Ofertas familiares
INSERT INTO products (category_slug, name, description, price, image_url, sort_order, popularity) VALUES
('ofertas-familiares', 'Oferton mas chaufa', 'Pollo entero, papas fritas, arroz chaufa, ensalada y bebidas 1.5lt.', 25500, 'img/ofertas familiares.png', 1, 10),
('ofertas-familiares', 'Oferton c/ fideos al pesto + ensalada', 'Pollo entero, papas fritas, fideos al pesto, ensalada y bebidas 1.5lt.', 25500, 'img/todo el menu.png', 2, 5),
('ofertas-familiares', 'Oferton con fideos al pesto pura papa', 'Pollo entero, papas fritas, fideos al pesto, extra papa frita y bebida 1.5lt.', 25500, '', 3, 3),
('ofertas-familiares', 'Oferton mas chaufa pura papa', 'Pollo entero, papas fritas, extra papa frita, arroz chaufa y bebidas 1.5lt.', 25500, 'img/oferton mas chaufa pura papa.png', 4, 8),
('ofertas-familiares', 'Oferton c/ fideos al pesto', 'Pollo entero, papas fritas, fideos al pesto y bebidas 1.5lt', 24500, 'img/oferton con fideo.png', 5, 7),
('ofertas-familiares', 'Oferton sin ensalada', 'Pollo entero, papas fritas, arroz chaufa y bebidas 1.5lt', 24500, 'img/oferton sin ensalada.png', 6, 6),
('ofertas-familiares', 'Oferton pura papa', 'Pollo entero, papas fritas, 1/2 porcion de papa frita y bebidas 1.5lt', 24500, 'img/oferton pura papa.png', 7, 5),
('ofertas-familiares', 'oferton familiar', 'Pollo entero, papas fritas, ensalada y bebidas 1.5lt', 23500, 'img/oferton familiar.png', 8, 9),
('ofertas-familiares', 'Oferton solo ensalada', 'Pollo entero, 2 ensaladas familiar y bebida 1.5lt.', 23500, '', 9, 2)
ON CONFLICT DO NOTHING;

-- Para el resto del menú, importe desde el panel admin o ejecute:
-- node supabase/generate-seed.js (si lo crea el equipo)
