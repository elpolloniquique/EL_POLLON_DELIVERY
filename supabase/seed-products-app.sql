-- Productos iniciales El Pollón — ejecutar después de schema-complete.sql
-- Vincula productos a categorías por slug

INSERT INTO products (branch_id, category_id, category_slug, name, description, price, image_url, sort_order)
SELECT b.id, c.id, c.slug, p.name, p.description, p.price, p.image_url, p.sort_order
FROM branches b
CROSS JOIN (VALUES
  ('ofertas-familiares', 'Oferton mas chaufa', 'Pollo entero, papas fritas, arroz chaufa, ensalada y bebidas 1.5lt.', 25500, '/img/ofertas familiares.png', 1),
  ('ofertas-familiares', 'Oferton c/ fideos al pesto + ensalada', 'Pollo entero, papas fritas, fideos al pesto, ensalada y bebidas 1.5lt.', 25500, '/img/todo el menu.png', 2),
  ('ofertas-familiares', 'Oferton mas chaufa pura papa', 'Pollo entero, papas fritas, extra papa frita, arroz chaufa y bebidas 1.5lt.', 25500, '/img/oferton mas chaufa pura papa.png', 3),
  ('ofertas-familiares', 'Oferton c/ fideos al pesto', 'Pollo entero, papas fritas, fideos al pesto y bebidas 1.5lt', 24500, '/img/oferton con fideo.png', 4),
  ('ofertas-familiares', 'Oferton sin ensalada', 'Pollo entero, papas fritas, arroz chaufa y bebidas 1.5lt', 24500, '/img/oferton sin ensalada.png', 5),
  ('ofertas-familiares', 'Oferton pura papa', 'Pollo entero, papas fritas, 1/2 porcion de papa frita y bebidas 1.5lt', 24500, '/img/oferton pura papa.png', 6),
  ('ofertas-familiares', 'oferton familiar', 'Pollo entero, papas fritas, ensalada y bebidas 1.5lt', 23500, '/img/oferton familiar.png', 7),
  ('ofertas-dos', '1/2 combo chaufa', 'Medio pollo, papas fritas, arroz chaufa', 16100, '/img/medio combo chaufa.png', 1),
  ('ofertas-dos', '1/2 combo', 'Medio pollo, papas fritas, ensalada personal', 15600, '/img/medio combo.png', 2),
  ('ofertas-dos', '1/2 combo pura papa', 'Medio pollo, papas fritas mas cantidad', 15600, '/img/medio combo pura papa.png', 3),
  ('ofertas-personales', '1/4 combo', '1/4 pollo, papas fritas personales, ensalada personal', 8400, '/img/personal combo.png', 1),
  ('ofertas-personales', '1/4 combo pura papa', '1/4 pollo, papas fritas personales mas cantidad', 8400, '/img/personal pura papa.png', 2),
  ('ofertas-personales', 'Chaufa brasa', '1/4 pollo, arroz chaufa', 8500, '/img/chaufa brasa.png', 3),
  ('platos-extras', 'Lomo saltado de carne c/ chaufa', '', 12500, '/img/lomo saltado con arroz chaufa.png', 1),
  ('platos-extras', 'Bistec a lo pobre', '', 11000, '/img/bistec a lo pobre.png', 2),
  ('platos-extras', 'Salchipapas', '', 7000, '/img/salchipapa.png', 3),
  ('agregados', '1 Pollo entero solo', '1 pollo entero', 16000, '/img/pollo solo.png', 1),
  ('agregados', 'Porcion de papas fritas familiar', 'Porción grande de papas crujientes', 9500, '/img/porcion de papa.png', 2),
  ('bebidas', 'Coca Cola', 'Bebida 1.5L', 4000, '/img/coca cola.png', 1),
  ('bebidas', 'Inca Kola', 'Bebida 1.5L', 4000, '/img/inca kola.png', 2),
  ('bebidas', 'Sprite', 'Bebida 1.5L', 4000, '/img/sprite.png', 3),
  ('descartables', 'Aluza CT5', 'Envase descartable', 300, '/img/aluza ct5.png', 1),
  ('descartables', 'Bolsa ecológica', 'Bolsa ecológica unidad', 200, '/img/bolsa ecologica.png', 2)
) AS p(cat, name, description, price, image_url, sort_order)
JOIN categories c ON c.branch_id = b.id AND c.slug = p.cat
WHERE b.slug = 'iquique'
ON CONFLICT DO NOTHING;
