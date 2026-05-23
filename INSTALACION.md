# Instalación completa — El Pollón + Supabase (gratis)

## Requisitos

- Cuenta en [supabase.com](https://supabase.com) (plan Free)
- Proyecto web en GitHub Pages o servidor local
- Navegador moderno

---

## Paso 1 — Proyecto Supabase

1. Crea proyecto **el-pollon-db** (o el nombre que prefieras).
2. Espera a que termine de crearse.

---

## Paso 2 — Claves API

1. **Project Settings** → **API**
2. Copia **Project URL** y **anon public key**
3. Pégalas en `js/supabase/config.js`:

```javascript
window.SUPABASE_CONFIG = {
  url: 'https://XXXX.supabase.co',
  anonKey: 'eyJ...',
  adminEmail: 'tu-correo@gmail.com',
  legacyAdminPassword: 'HUILLCA123',
  storageBucket: 'product-images'
};
```

---

## Paso 3 — Base de datos (SQL Editor)

Ejecuta **en orden** (New query → pegar → Run):

| Orden | Archivo |
|-------|---------|
| 1 | `supabase/schema-es.sql` |
| 2 | `supabase/storage.sql` |
| 3 | `supabase/seed-productos-es.sql` |

Si ya tenías tabla `productos` manual con 1 fila, no importa: el seed usa la tabla nueva del schema.

---

## Paso 4 — Storage

1. Menú **Storage** → verifica bucket **product-images** (público).
2. Si no existe, créalo público con el SQL de `storage.sql`.

---

## Paso 5 — Usuario administrador

1. **Authentication** → **Users** → **Add user**
2. Email: el mismo que en `config.js` → `adminEmail`
3. Contraseña segura
4. SQL Editor → ejecuta `supabase/crear-admin.sql` (ajusta el email si hace falta)

---

## Paso 6 — Realtime

1. **Database** → **Replication**
2. Activa **pedidos** en realtime

---

## Paso 7 — Probar

| URL | Qué probar |
|-----|------------|
| `index.html` | Menú, carrito, pedido WhatsApp |
| `login.html` | Inicio sesión admin |
| `admin.html` | Dashboard, pedidos, productos |

En consola del navegador (F12) debe aparecer: `[Pollón] Menú cargado desde Supabase`

---

## Archivos principales

```
index.html      → Tienda (clientes)
login.html      → Acceso admin
admin.html      → Panel completo
js/app.js       → Carrito y menú
js/admin-app.js → Panel admin
supabase/       → Scripts SQL
```

---

## Roles

| Rol | Permisos |
|-----|----------|
| super_admin | Todo |
| administrador | Productos, pedidos, ventas, config |
| cajero | Pedidos, tickets |
| cocina | Ver pedidos y cambiar estado |

Edita rol en tabla `administradores`.

---

## Respaldo sin Supabase

Si no configuras claves, la tienda usa menú local y pedidos en el navegador (`localStorage`). El admin acepta contraseña **HUILLCA123** en modo legacy.

---

## Soporte

Revisa `SUPABASE-SETUP.md` para detalles técnicos y migración desde Firebase.
