/**
 * Genera supabase/seed-products-full.sql desde js/products-fallback.js
 * Uso: node supabase/generate-seed.js
 */
const fs = require('fs');
const path = require('path');

const fallbackPath = path.join(__dirname, '../js/products-fallback.js');
const outPath = path.join(__dirname, 'seed-products-full.sql');

const code = fs.readFileSync(fallbackPath, 'utf8')
  .replace(/window\.POLLON_FALLBACK_PRODUCTS/, 'global.POLLON_FALLBACK_PRODUCTS');
eval(code);

const data = global.POLLON_FALLBACK_PRODUCTS;
if (!data) {
  console.error('No se encontró POLLON_FALLBACK_PRODUCTS');
  process.exit(1);
}

const esc = (s) => String(s || '').replace(/'/g, "''");
const lines = ['-- Auto-generado — no editar a mano', ''];

let order = 0;
Object.keys(data).forEach((slug) => {
  (data[slug] || []).forEach((p) => {
    order += 1;
    lines.push(
      `INSERT INTO products (category_slug, name, description, price, image_url, sort_order) VALUES (` +
      `'${esc(slug)}', '${esc(p.name)}', '${esc(p.description)}', ${Number(p.price) || 0}, ` +
      `'${esc(p.image)}', ${order});`
    );
  });
});

fs.writeFileSync(outPath, lines.join('\n'));
console.log('Generado:', outPath, '—', order, 'productos');
