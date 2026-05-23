/**
 * Genera seed-productos-es.sql desde products-fallback.js
 * node supabase/generate-seed-es.js
 */
const fs = require('fs');
const path = require('path');

const fallbackPath = path.join(__dirname, '../js/products-fallback.js');
const outPath = path.join(__dirname, 'seed-productos-es.sql');

const code = fs.readFileSync(fallbackPath, 'utf8')
  .replace(/window\.POLLON_FALLBACK_PRODUCTS/, 'global.POLLON_FALLBACK_PRODUCTS');
eval(code);
const data = global.POLLON_FALLBACK_PRODUCTS;

const esc = (s) => String(s || '').replace(/'/g, "''");
const lines = [
  '-- Seed productos — ejecutar después de schema-es.sql',
  ''
];

let n = 0;
Object.keys(data).forEach((slug) => {
  (data[slug] || []).forEach((p) => {
    n += 1;
    lines.push(`
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, stock, disponible, destacado)
SELECT '${esc(p.name)}', '${esc(p.description)}', ${Number(p.price) || 0},
  c.id, '${esc(p.image)}', 99, true, false
FROM categorias c WHERE c.slug = '${esc(slug)}'
ON CONFLICT DO NOTHING;`.trim());
  });
});

fs.writeFileSync(outPath, lines.join('\n\n'));
console.log('OK:', outPath, '-', n, 'productos');
