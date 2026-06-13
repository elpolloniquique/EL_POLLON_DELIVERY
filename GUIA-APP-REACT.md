# Guía completa — El Pollón Delivery App (React + Supabase)

Aplicación web profesional tipo app móvil para **Pollería El Pollón**. Esta guía explica paso a paso cómo dejar todo funcionando al 100%.

---

## 1. Estructura del proyecto

```
EL_POLLON_DELIVERY/
├── index.html              ← Entrada Vite (NUEVA app React)
├── index-legacy.html       ← Respaldo de la web anterior
├── package.json            ← Dependencias Node
├── vite.config.js
├── tailwind.config.js
├── vercel.json             ← Config despliegue Vercel
├── .env.example            ← Plantilla variables de entorno
├── public/img/             ← Imágenes (enlazado a /img)
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/         ← UI cliente
│   ├── pages/              ← Páginas cliente
│   ├── admin/              ← Panel administración
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── store/
│   ├── utils/
│   ├── data/
│   └── styles/
├── supabase/
│   ├── schema-complete.sql ← SQL principal (EJECUTAR PRIMERO)
│   └── seed-products-app.sql ← Productos de ejemplo
├── config/                 ← Config legacy (referencia)
├── js/                     ← Código legacy (referencia)
└── admin.html              ← Admin legacy (referencia)
```

---

## 2. Configurar Supabase

### Paso 2.1 — Crear proyecto
1. Entra a [https://supabase.com](https://supabase.com)
2. Crea un proyecto nuevo (Free Plan)
3. Espera a que termine de provisionarse

### Paso 2.2 — Ejecutar SQL
1. Ve a **SQL Editor** → **New query**
2. Copia y pega todo el contenido de `supabase/schema-complete.sql`
3. Pulsa **Run**
4. Repite con `supabase/seed-products-app.sql` para cargar productos

### Paso 2.3 — Crear usuario administrador
1. Ve a **Authentication** → **Users** → **Add user**
2. Crea un usuario con email y contraseña (ej: `admin@elpollon.cl`)
3. Copia el **UUID** del usuario creado
4. En SQL Editor ejecuta:

```sql
INSERT INTO admin_users (id, email, full_name, role_slug, active)
VALUES (
  'PEGAR-UUID-AQUI',
  'admin@elpollon.cl',
  'Administrador',
  'super_admin',
  true
);
```

### Paso 2.4 — Obtener claves API
1. Ve a **Project Settings** → **API**
2. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### Paso 2.5 — Storage (opcional, para subir imágenes)
1. Ve a **Storage** → crea bucket `productos` (público)
2. Sube imágenes y usa las URLs en productos/banners

---

## 3. Variables de entorno

### Paso 3.1 — Crear archivo `.env`
En la raíz del proyecto, crea `.env` (copia de `.env.example`):

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Importante:** El archivo `.env` NO se sube a GitHub (está en `.gitignore`).

---

## 4. Probar localmente

### Requisitos
- [Node.js](https://nodejs.org) 18 o superior
- npm

### Comandos

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre `http://localhost:5173` en el navegador o en tu celular (misma red WiFi).

### Build de producción local

```bash
npm run build
npm run preview
```

---

## 5. Desplegar en Vercel

### Paso 5.1 — Subir a GitHub
Sube el repositorio completo (sin `.env` ni `node_modules`).

### Paso 5.2 — Conectar Vercel
1. Entra a [https://vercel.com](https://vercel.com)
2. **Import Project** → selecciona tu repo
3. Framework: **Vite** (detectado automáticamente)
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Paso 5.3 — Variables en Vercel
En **Settings** → **Environment Variables** agrega:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Redeploy después de agregar las variables.

---

## 6. Qué archivos crear / reemplazar

| Acción | Archivo |
|--------|---------|
| **NUEVO** | Todo `src/`, `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vercel.json`, `.env.example` |
| **REEMPLAZADO** | `index.html` (ahora es entrada React) |
| **RESPALDO** | `index-legacy.html` (web anterior intacta) |
| **MANTENER** | `img/`, `sounds/`, `config/`, `js/`, `admin.html` (legacy) |
| **NUEVO SQL** | `supabase/schema-complete.sql`, `supabase/seed-products-app.sql` |

---

## 7. Funcionalidades incluidas

### Cliente (app móvil)
- Menú con categorías y búsqueda
- Cards de productos premium
- Personalización (bebidas, bolsas)
- Carrito flotante + drawer
- Checkout con datos de entrega
- Pedido por WhatsApp con mensaje formateado
- Delivery, retiro y reservas (modales)
- Modo oscuro/claro
- Navegación inferior tipo app
- Info: horarios, zonas, contacto, mapa

### Admin (`/admin`)
- Login con Supabase Auth
- Dashboard con ventas día/semana/mes
- Gráficos (Chart.js)
- Gestión de pedidos en tiempo real
- Cambio de estados y repartidores
- Exportar CSV
- CRUD productos y categorías
- Banners y promociones
- Zonas de delivery
- Configuración general del negocio
- Roles: super_admin, admin, cocina, delivery, cajera

### Supabase
- Tablas: settings, branches, categories, products, product_options, delivery_zones, orders, order_items, banners, promotions, admin_users, roles, business_policies
- RLS, triggers updated_at, seeds iniciales

---

## 8. Rutas de la aplicación

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio con banner y accesos rápidos |
| `/menu` | Menú de productos |
| `/carrito` | Vista carrito |
| `/info` | Información y contacto |
| `/admin/login` | Login administrador |
| `/admin` | Dashboard |
| `/admin/pedidos` | Gestión pedidos |
| `/admin/productos` | CRUD productos |
| `/admin/categorias` | CRUD categorías |
| `/admin/banners` | Gestión banners |
| `/admin/delivery` | Zonas y promociones |
| `/admin/configuracion` | Config general |

---

## 9. Sin Supabase (modo demo)

La app funciona sin Supabase usando datos de fallback en `src/data/fallback.js`:
- Menú con productos de ejemplo
- Carrito y WhatsApp funcionan
- Pedidos se guardan en `localStorage`
- Admin requiere Supabase para login

---

## 10. Solución de problemas

| Problema | Solución |
|----------|----------|
| Pantalla en blanco | Revisa consola del navegador; ejecuta `npm install` |
| No carga menú | Verifica `.env` y que ejecutaste el SQL |
| Admin no deja entrar | Crea usuario en Auth + fila en `admin_users` |
| Imágenes rotas | Verifica que `public/img` existe (junction a `img/`) |
| Build falla en Vercel | Agrega variables `VITE_*` en Vercel |

---

## 11. Próximos pasos recomendados

1. Cargar todos los productos desde `config/products.js` al SQL
2. Configurar Storage de Supabase para subir fotos desde admin
3. Ajustar políticas RLS en producción (más restrictivas para orders)
4. Configurar dominio personalizado en Vercel
5. Agregar PWA (manifest + service worker) para instalar como app

---

**¿Necesitas ayuda?** Revisa `SUPABASE-SETUP.md` y `GUIA-PRINCIPIANTE-SUPABASE.md` del proyecto legacy.
