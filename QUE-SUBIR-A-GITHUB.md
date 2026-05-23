# Qué subir y qué NO subir a GitHub — El Pollón

## Tu error (corregido)

Tenías mezclados los campos:

| Campo | ❌ Lo que pusiste mal | ✅ Valor correcto |
|-------|----------------------|-------------------|
| `url` | `TU_SUPABASE_URL` | `https://xydsjbpstrihdgqinyco.supabase.co` |
| `anonKey` | La URL de Supabase | `sb_publishable_JKpdh8g9QNA4HIzvNr-z_g_W74lU5mm` |
| `legacyAdminPassword` | En config.js | **Vacío** en GitHub — solo en config.local.js |

---

## ✅ SÍ SUBIR a GitHub

Todo el proyecto **EXCEPTO** `config.local.js`:

- `index.html`, `login.html`, `admin.html`
- carpeta `js/` (incluye **`js/supabase/config.js`** ya corregido)
- carpeta `css/`, `img/`, `supabase/*.sql`
- `.gitignore`
- guías `.md`

## ❌ NO SUBIR nunca

| Archivo | Por qué |
|---------|---------|
| `js/supabase/config.local.js` | Tiene tu **contraseña** |
| Contraseñas en cualquier archivo | GitHub las bloquea |

---

## Archivos config (resumen)

| Archivo | ¿Sube? | Qué tiene |
|---------|--------|-----------|
| `config.js` | **SÍ** | URL + anonKey + email (sin contraseña) |
| `config.local.js` | **NO** | Todo + contraseña `@vivar1086#` |
| `config.local.example.js` | SÍ | Plantilla vacía (ejemplo) |

---

## Pasos para subir ahora (VS Code)

1. Guarda todo (`Ctrl + S`)
2. Source Control → deberías ver cambios en `config.js`
3. Mensaje: `Config Supabase listo para producción`
4. **Commit** → **Sync / Push**

Si GitHub pregunta por la clave `sb_publishable_...` puedes autorizarla (es la clave pública del navegador).  
**Nunca** autorices subir la contraseña.

---

## Después del push

1. Espera 1–2 minutos
2. Abre: https://elpolloniquique.github.io/EL-POLLON-/
3. F12 → Console → debe cargar menú desde Supabase

---

## En tu PC (local)

Sigue existiendo `config.local.js` con la contraseña para modo respaldo en `login.html`.
