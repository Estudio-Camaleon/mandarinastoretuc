# 🍊 Mandarina Store Tuc

Tienda online de stickers, cuadernos, agendas, pins, prints y más — con carrito, panel admin y WhatsApp.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Estilos | Tailwind CSS 4 + shadcn/ui |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| CI/CD | GitHub Actions + semantic-release |

## Scripts

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build producción
npm run lint       # ESLint
npm run format     # Prettier
npm run release    # semantic-release (manual)
```

## Setup local

1. Clonar el repo e instalar dependencias:

```bash
git clone https://github.com/Estudio-Camaleon/mandarinastoretuc.git
cd mandarinastoretuc
npm i
```

2. Crear archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://URL_SUPABASE.supabase.co
VITE_SUPABASE_ANON_KEY=ANON_KEY
VITE_WHATSAPP_PHONE=54938222222
```

3. Correr migraciones en Supabase SQL Editor (o con `supabase db push` luego de hacer login):

| Orden | Archivo | Descripción |
|---|---|---|
| 1 | `supabase/migrations/00001_initial_schema.sql` | Schema base (productos, categorías, pedidos) |
| 2 | `supabase/migrations/00002_storage_policies.sql` | Bucket `product-images` con RLS |
| 3 | `supabase/migrations/00003_dynamic_data.sql` | Iconos, imágenes, specs dinámicas |
| 4 | `supabase/migrations/00004_remove_categories.sql` | Limpieza de categorías |

4. Crear bucket `product-images` en Supabase Storage (público).

5. Iniciar sesión como admin desde el botón 🔑 en el navbar.

## Admin panel

- Ruta protegida con autenticación Supabase (email/password)
- Gestión completa de productos (crear, editar, eliminar, subir imágenes)
- Gestión de categorías (crear, editar, eliminar, subir imagen de portada)
- Vista de pedidos recibidos

## WhatsApp

El carrito genera un mensaje de WhatsApp con el resumen del pedido al hacer clic en "Enviar pedido por WhatsApp". Configurar `VITE_WHATSAPP_PHONE` con el número destino.

## Commits y releases

### Formato de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para que semantic-release pueda generar versiones automáticas.

```
feat:         ✨ Nueva funcionalidad
fix:          🐛 Corrección de bug
refactor:     ♻️ Refactor sin cambios funcionales
docs:         📝 Documentación
style:        💄 Estilos (espacios, formato)
perf:         ⚡ Mejora de rendimiento
chore:        🔧 Tareas de mantenimiento / config
```

### Agente commiteador (openCode)

Usar el agente **Commiteador** en openCode para commitear y pushear automáticamente con el formato correcto.

### Auto release

Cada push a `main` ejecuta el workflow `.github/workflows/release.yml`:

1. Instala dependencias
2. Corre semantic-release
3. Genera `CHANGELOG.md` automático
4. Crea GitHub Release con tag semántico (`v1.0.0`, `v1.1.0`, etc.)
