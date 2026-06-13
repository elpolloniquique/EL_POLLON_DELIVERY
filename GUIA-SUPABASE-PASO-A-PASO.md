# Guía Supabase para principiantes — El Pollón Delivery (App React)

**Para quién es esta guía:** Si nunca has usado Supabase y es tu primera vez conectando una base de datos, sigue **cada paso en orden**. No saltes ninguno.

**Tiempo estimado:** 45–60 minutos la primera vez.

Marca cada casilla cuando termines: `[ ]` → `[x]`

---

## ¿Qué es Supabase? (en palabras simples)

Imagina que Supabase es como un **Google Sheets en la nube**, pero mucho más potente:

- Guarda tus **productos**, **pedidos**, **categorías**, etc.
- Te da un **login seguro** para el panel de administración.
- Tu app web (la que abres en el celular) **lee y escribe** datos ahí automáticamente.

**No pagas nada** con el plan Free (gratis).

---

## ¿Qué vas a lograr al terminar?

| # | Resultado |
|---|-----------|
| 1 | Proyecto Supabase creado en la nube |
| 2 | Todas las tablas del menú y pedidos creadas |
| 3 | Productos de ejemplo cargados |
| 4 | Tu app React conectada a la base de datos |
| 5 | Login de administrador funcionando |
| 6 | Pedidos guardándose cuando un cliente compra |

---

# PARTE 1 — Crear cuenta y proyecto en Supabase

## Paso 1.1 — Crear cuenta

- [ ] Abre el navegador (Chrome o Edge)
- [ ] Ve a: **https://supabase.com**
- [ ] Clic en **Start your project** o **Sign in**
- [ ] Regístrate con **Google** o con tu **correo**
- [ ] Confirma tu correo si te lo pide

**✅ Listo si:** ves el panel principal (Dashboard) de Supabase.

---

## Paso 1.2 — Crear el proyecto

- [ ] En el Dashboard, clic en el botón verde **New project**
- [ ] **Organization:** deja la que te asigna (Free)
- [ ] **Name:** escribe `el-pollon-delivery` (o el nombre que quieras)
- [ ] **Database Password:** inventa una contraseña fuerte (ej: `Pollon2025!Segura`)
  - ⚠️ **ANÓTALA** en un bloc de notas. Es la contraseña de la base de datos interna.
  - **NO es** la contraseña del admin de tu web.
- [ ] **Region:** elige la más cercana (si aparece South America, elígela)
- [ ] Clic en **Create new project**
- [ ] **ESPERA 2–3 minutos** mientras dice "Setting up project..."

**✅ Listo si:** ves el menú lateral izquierdo con iconos (Home, Table Editor, SQL Editor, etc.).

---

## Paso 1.3 — Ubicar tu proyecto

Arriba verás el nombre de tu proyecto. En la barra de direcciones del navegador verás algo como:

```
https://supabase.com/dashboard/project/abcdefghijklmnop/...
```

Ese código largo (`abcdefghijklmnop`) es tu **ID de proyecto**. No necesitas memorizarlo, pero es útil saber dónde está.

---

# PARTE 2 — Crear las tablas (pegar el SQL)

Aquí es donde "construyes" la base de datos de El Pollón.

## Paso 2.1 — Abrir el SQL Editor

En Supabase:

- [ ] Menú izquierdo → clic en **SQL Editor** (icono de terminal/código)
- [ ] Clic en el botón **+ New query** (arriba a la derecha)

Verás un editor de texto grande en blanco. **Ahí es donde pegarás el código SQL.**

---

## Paso 2.2 — Pegar el archivo principal (TABLAS + DATOS INICIALES)

Este archivo crea **todas las tablas** del proyecto.

### En Cursor (tu editor de código):

- [ ] Abre la carpeta del proyecto: `EL_POLLON_DELIVERY`
- [ ] En el explorador de archivos (izquierda), busca la carpeta **`supabase`**
- [ ] Abre el archivo: **`schema-complete.sql`**
- [ ] Selecciona **TODO** el contenido: presiona `Ctrl + A`
- [ ] Copia: presiona `Ctrl + C`

### En Supabase (SQL Editor):

- [ ] Haz clic dentro del editor en blanco
- [ ] Pega: presiona `Ctrl + V`
- [ ] Deberías ver muchas líneas que empiezan con `--` y `CREATE TABLE`
- [ ] Abajo a la derecha, clic en el botón verde **Run** (o `Ctrl + Enter`)
- [ ] Espera unos segundos

### Resultado esperado:

- [ ] Abajo aparece mensaje **Success** (éxito) en verde
- [ ] Si sale algo en amarillo o rojo, lee la sección **Errores comunes** al final de esta guía

**✅ Listo si:** dice Success.

---

## Paso 2.3 — Verificar que las tablas se crearon

- [ ] Menú izquierdo → **Table Editor**
- [ ] Deberías ver estas tablas en la lista:

| Tabla | Para qué sirve |
|-------|----------------|
| `settings` | Nombre, teléfono, logo, colores del negocio |
| `categories` | Categorías del menú (Familiares, Bebidas…) |
| `products` | Productos y precios |
| `orders` | Pedidos de clientes |
| `order_items` | Detalle de cada pedido |
| `delivery_zones` | Zonas y costos de delivery |
| `banners` | Banners del inicio |
| `promotions` | Promociones |
| `admin_users` | Usuarios administradores |
| `roles` | Roles del sistema |
| `branches` | Sucursales |
| `business_policies` | Políticas (delivery, retiro, reservas) |
| `product_options` | Bebidas, bolsas, opciones |

- [ ] Clic en **`categories`** → deberías ver **8 filas** (Todo el Menú, Ofertas Familiares, etc.)
- [ ] Clic en **`settings`** → deberías ver **1 fila** con datos de El Pollón

**✅ Listo si:** ves las tablas y categorías con datos.

---

## Paso 2.4 — Cargar los productos (SEGUNDO SQL)

El archivo anterior creó las tablas pero pocos productos. Ahora cargamos el menú.

### En Cursor:

- [ ] Abre: **`supabase/seed-products-app.sql`**
- [ ] `Ctrl + A` → `Ctrl + C` (copiar todo)

### En Supabase:

- [ ] SQL Editor → **+ New query** (nueva consulta, no borres la anterior)
- [ ] `Ctrl + V` (pegar)
- [ ] Clic **Run**

**✅ Listo si:** Success y en **Table Editor → products** ves **más de 20 productos**.

---

# PARTE 3 — Obtener las claves para conectar tu app

Tu app necesita dos datos de Supabase para conectarse. Son como la "dirección" y la "llave" de tu base de datos.

## Paso 3.1 — Copiar Project URL y anon key

- [ ] Menú izquierdo, **abajo del todo** → **Project Settings** (icono ⚙️ engranaje)
- [ ] En el submenú → clic en **API**
- [ ] Busca la sección **Project URL**
  - Copia la URL completa. Ejemplo: `https://abcdefgh.supabase.co` 
- [ ] Busca **Project API keys**
  - Copia la clave **`anon` `public`** (es una cadena larga que empieza con `eyJ...`)
  - ⚠️ **NO copies** la clave `service_role`. Esa es secreta y no va en tu web.

     https://imgdlmomoxqaziqrlsjj.supabase.co
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZ2RsbW9tb3hxYXppcXJsc2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMTc0NTksImV4cCI6MjA5Njg5MzQ1OX0.jzRcveDsnFh9aKCpnfYq6FVS7GaSK75_lO-9V3Mf5ks

**✅ Listo si:** tienes anotados en un bloc de notas:
1. Project URL
2. anon public key

---

## Paso 3.2 — Crear el archivo `.env` en tu proyecto

El archivo `.env` le dice a tu app React dónde está Supabase.

### En Cursor:

- [ ] En la raíz del proyecto (donde está `package.json`), busca el archivo **`.env.example`**
- [ ] Clic derecho → **Copy** o duplícalo
- [ ] Renómbralo a: **`.env`** (solo `.env`, sin `.example`)
- [ ] Abre `.env` y reemplaza los valores:

```env
VITE_SUPABASE_URL=https://TU-ID-AQUI.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...pega-toda-la-clave-aqui
```

**Ejemplo real (con datos inventados):**

```env
VITE_SUPABASE_URL=https://jhpfxxwudxyhldisxrro.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocGZ4eHd1ZHh5aGxkaXN4cnJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY...
```

- [ ] Guarda: `Ctrl + S`

⚠️ **IMPORTANTE:**
- No dejes espacios antes ni después del `=`
- No pongas comillas alrededor de los valores
- El archivo `.env` **NO se sube a GitHub** (ya está en `.gitignore`)

**✅ Listo si:** tu `.env` tiene tu URL y clave reales (no dice `TU_PROYECTO`).

---

# PARTE 4 — Crear el usuario administrador

Para entrar al panel `/admin` necesitas un usuario con permisos.

## Paso 4.1 — Crear usuario en Authentication

- [ ] En Supabase, menú izquierdo → **Authentication**
- [ ] Pestaña **Users**
- [ ] Clic en **Add user** → **Create new user**
- [ ] **Email:** tu correo real (ej: `polloniquique@gmail.com`)
- [ ] **Password:** inventa una contraseña (ej: `PollonAdmin2025!`)
  - **ANÓTALA** — la usarás para entrar al panel admin
- [ ] Marca **Auto Confirm User** si aparece la opción
- [ ] Clic **Create user**

**✅ Listo si:** el usuario aparece en la lista con estado confirmado (verde).

---

## Paso 4.2 — Dar permisos de administrador (tercer SQL)

Crear el usuario en Authentication no basta. Hay que decirle a la base de datos que es admin.

### En Cursor:

- [ ] Abre: **`supabase/crear-admin-app.sql`**
- [ ] En la línea que dice `TU-CORREO@gmail.com`, **cámbiala** por el mismo correo que usaste en el Paso 4.1
- [ ] `Ctrl + A` → `Ctrl + C`

### En Supabase:

- [ ] SQL Editor → **+ New query**
- [ ] Pegar → **Run**

**✅ Listo si:** Table Editor → **`admin_users`** → 1 fila con tu correo y `role_slug` = `super_admin`.

---

# PARTE 5 — Activar pedidos en tiempo real (opcional pero recomendado)

Para que los pedidos nuevos aparezcan solos en el panel admin:

- [ ] Menú **Database** → **Publications** (o busca "Replication")
- [ ] Verifica que la tabla **`orders`** esté en la publicación `supabase_realtime`
- [ ] Si no está: en **Database** → **Tables** → tabla `orders` → activa **Realtime**

(El SQL `schema-complete.sql` ya intenta activarlo automáticamente.)

---

# PARTE 6 — Probar tu app en tu computador

## Paso 6.1 — Instalar dependencias (solo la primera vez)

Abre una terminal en Cursor:

- [ ] Menú **Terminal** → **New Terminal**
- [ ] Asegúrate de estar en la carpeta del proyecto
- [ ] Escribe y presiona Enter:

```bash
npm install
```

Espera a que termine (puede tardar 1–2 minutos).

---

## Paso 6.2 — Iniciar la app

En la misma terminal:

```bash
npm run dev
```

- [ ] Verás algo como: `Local: http://localhost:5173/`
- [ ] El navegador se abrirá solo, o abre esa URL manualmente

---

## Paso 6.3 — Prueba 1: Menú desde Supabase

- [ ] Abre `http://localhost:5173/menu`
- [ ] Deberías ver productos (Oferton, combos, bebidas…)
- [ ] Presiona **F12** → pestaña **Console**
- [ ] NO debe decir "Supabase no configurado"

**Si el menú está vacío:** revisa tu archivo `.env` y reinicia el servidor (`Ctrl + C` en terminal, luego `npm run dev` otra vez).

---

## Paso 6.4 — Prueba 2: Hacer un pedido de prueba

- [ ] Agrega un producto al carrito
- [ ] Clic en el carrito → **Realizar Pedido por WhatsApp**
- [ ] Completa nombre, teléfono y dirección
- [ ] Envía el pedido

**Verificar en Supabase:**

- [ ] Table Editor → **`orders`** → debe aparecer **1 fila nueva** con tus datos

---

## Paso 6.5 — Prueba 3: Panel administrador

- [ ] Abre: `http://localhost:5173/admin/login`
- [ ] Email: el que creaste en Authentication
- [ ] Contraseña: la que creaste en Authentication
- [ ] Debe entrar al dashboard

- [ ] Ve a **Pedidos** → deberías ver el pedido de prueba
- [ ] Ve a **Productos** → deberías ver la lista
- [ ] Ve a **Configuración** → deberías ver datos de El Pollón

**✅ PROYECTO AL 100%** cuando las 3 pruebas funcionan.

---

# RESUMEN VISUAL — ¿Dónde pego cada cosa?

```
┌─────────────────────────────────────────────────────────────┐
│  SUPABASE (en el navegador)                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SQL Editor → New query                                     │
│    1º PEGAR: supabase/schema-complete.sql    → Run         │
│    2º PEGAR: supabase/seed-products-app.sql  → Run         │
│    3º PEGAR: supabase/crear-admin-app.sql      → Run         │
│                                                             │
│  Authentication → Users → Add user (email + password)       │
│                                                             │
│  Project Settings → API → copiar URL y anon key             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  CURSOR (en tu computador)                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Crear archivo: .env (en la raíz, junto a package.json)     │
│    VITE_SUPABASE_URL=...                                    │
│    VITE_SUPABASE_ANON_KEY=...                               │
│                                                             │
│  Terminal: npm install → npm run dev                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# Orden exacto de los archivos SQL

| Orden | Archivo | Cuándo ejecutarlo |
|-------|---------|-------------------|
| **1º** | `supabase/schema-complete.sql` | Primero, crea todo |
| **2º** | `supabase/seed-products-app.sql` | Después del 1º |
| **3º** | `supabase/crear-admin-app.sql` | Después de crear usuario en Authentication |

**Nunca ejecutes el 3º antes del 1º.** Las tablas deben existir primero.

---

# Errores comunes y soluciones

| Error | Qué significa | Solución |
|-------|---------------|----------|
| `relation "categories" already exists` | Ya ejecutaste el SQL antes | Normal si repites. Las tablas ya existen, continúa al siguiente paso |
| `Invalid API key` | Clave mal copiada en `.env` | Vuelve a Settings → API y copia de nuevo la anon key completa |
| Menú vacío en la app | No conecta a Supabase | Revisa `.env`, reinicia con `npm run dev` |
| "Supabase no configurado" en consola | `.env` vacío o mal nombrado | El archivo debe llamarse exactamente `.env` (con punto al inicio) |
| Admin: "Usuario no autorizado" | Falta fila en `admin_users` | Ejecuta `crear-admin-app.sql` con tu email correcto |
| Login admin no entra | Contraseña incorrecta | Usa la de Authentication, no la Database Password |
| `npm` no reconocido | Node.js no instalado | Instala Node.js desde https://nodejs.org (versión LTS) |
| Pedido no se guarda | Tabla orders no existe | Ejecuta `schema-complete.sql` de nuevo |

---

# Preguntas frecuentes

### ¿Cuánto cuesta Supabase?
**Gratis** en el plan Free. Suficiente para empezar con El Pollón.

### ¿Puedo borrar todo y empezar de nuevo?
Sí. En SQL Editor puedes borrar tablas, o crea un **proyecto nuevo** en Supabase.

### ¿Dónde edito productos después?
En tu app: `http://localhost:5173/admin/productos`  
O directamente en Supabase: Table Editor → `products`

### ¿El archivo `.env` va a GitHub?
**NO.** Nunca lo subas. Contiene claves de acceso.

### ¿Qué diferencia hay entre `.env` y el SQL?
- **SQL** = construye la base de datos (tablas, datos iniciales) — se pega en **Supabase**
- **`.env`** = conecta tu app React a esa base de datos — se crea en **Cursor**

---

# Checklist final

- [ ] Cuenta Supabase creada
- [ ] Proyecto `el-pollon-delivery` creado
- [ ] `schema-complete.sql` ejecutado (Success)
- [ ] `seed-products-app.sql` ejecutado (Success)
- [ ] Tablas visibles en Table Editor
- [ ] `.env` creado con URL y anon key
- [ ] Usuario creado en Authentication
- [ ] `crear-admin-app.sql` ejecutado
- [ ] `npm install` y `npm run dev` funcionan
- [ ] Menú muestra productos
- [ ] Pedido de prueba guardado en `orders`
- [ ] Login admin funciona

**Cuando todas las casillas estén marcadas, tu proyecto está conectado al 100%.**

---

¿Te atoras en algún paso? Anota **en qué número de paso** te quedaste y qué mensaje de error ves (si hay). Con eso se puede ayudarte exactamente.
