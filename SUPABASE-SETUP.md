# Configuración Supabase — Pollería El Pollón

> Guía para principiantes: ver también **INSTALACION.md**

## 1. Crear proyecto

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto (plan **Free**).
2. En **Settings → API**, copia:
   - **Project URL**
   - **anon public key**

## 2. Configurar la web

Edita `js/supabase/config.js`:

```javascript
window.SUPABASE_CONFIG = {
  url: 'https://TU_PROYECTO.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  adminEmail: 'tu-correo@gmail.com',
  legacyAdminPassword: 'HUILLCA123',
  storageBucket: 'product-images'
};
```

> Sin configurar Supabase, el sitio sigue funcionando con menú local y pedidos en `localStorage`.

## 3. Base de datos (esquema en español — recomendado)

En **SQL Editor**, ejecuta en este orden:

1. `supabase/schema-es.sql`
2. `supabase/storage.sql`
3. `supabase/seed-productos-es.sql` (59 productos)
4. `supabase/crear-admin.sql` (después de crear usuario en Auth)

### Esquema legacy (inglés)

Si ya usaste el esquema anterior:

1. `supabase/schema.sql`
2. `supabase/seed-products-full.sql`

Para regenerar el seed desde el menú local:

```bash
node supabase/generate-seed.js
```

## 4. Realtime

En **Database → Replication**, confirma que la tabla `orders` está en la publicación `supabase_realtime` (el schema.sql lo intenta añadir).

## 5. Storage (imágenes)

1. Crea el bucket `product-images` (público) si no existe.
2. Sube imágenes desde el panel o Storage UI.
3. En `products.image_url` usa la URL pública de Supabase Storage.

## 6. Admin con Auth (recomendado)

1. **Authentication → Users** → crea usuario `admin@elpollon.cl`.
2. Inicia sesión en la web con esa contraseña (o usa la contraseña legacy `HUILLCA123` como respaldo).
3. En producción, endurece las políticas RLS de `orders` para que solo `authenticated` pueda leer/actualizar.

## 7. Migrar pedidos desde Firebase

Exporta JSON desde Firebase Realtime DB (`pollon_orders_v1`) e inserta en `orders`:

| Firebase | Supabase |
|----------|----------|
| `createdAt` | `created_at` |
| `ticketNumber` | `ticket_number` |
| `deliveredAt` | `delivered_at` |
| `customer` | `customer` (jsonb) |
| `items` | `items` (jsonb) |

## Estructura del proyecto

```
EL-POLLON-/
├── index.html
├── css/
│   ├── styles.css
│   └── premium.css
├── js/
│   ├── app.js
│   ├── admin.js
│   ├── products-fallback.js
│   ├── supabase/config.js
│   └── services/
│       ├── supabase-client.js
│       ├── orders-service.js
│       ├── products-service.js
│       └── auth-service.js
└── supabase/
    ├── schema.sql
    ├── storage.sql
    └── seed-products-full.sql
```
