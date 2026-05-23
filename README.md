# Pollería El Pollón — Carta digital

Plataforma web de pedidos (delivery, reservas, retiros) con panel de administración y backend **Supabase**.

**Sitio en producción:** [elpolloniquique.github.io/EL-POLLON-/](https://elpolloniquique.github.io/EL-POLLON-/)

## Inicio rápido

1. Abre `index.html` en un servidor local o GitHub Pages.
2. Configura Supabase en `js/supabase/config.js` (ver [SUPABASE-SETUP.md](./SUPABASE-SETUP.md)).
3. Sin Supabase, el menú y pedidos usan respaldo local (`products-fallback.js` + `localStorage`).

## Estructura

| Carpeta / archivo | Uso |
|-------------------|-----|
| `index.html` | Página principal |
| `css/styles.css` | Estilos base |
| `css/premium.css` | UI premium (loader, hero, cards) |
| `js/app.js` | Lógica carrito, menú, admin, WhatsApp |
| `js/admin.js` | Timbre nuevos pedidos |
| `js/products-fallback.js` | Menú local de respaldo |
| `js/services/` | Cliente Supabase, pedidos, productos, auth |
| `supabase/` | SQL schema, seed, storage |

## Funcionalidades

- Menú por categorías, carrito, personalización (bebidas, bolsa)
- Pedido por WhatsApp + guardado en base de datos
- Panel admin: estadísticas, filtros, estados, impresión ticket, Excel
- Realtime de pedidos (con Supabase configurado)
- SEO: meta tags, schema Restaurant, sitemap, robots.txt

## Licencia

Uso privado — Pollería El Pollón, Iquique.
