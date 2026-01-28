# SPEC-26-01-2026-CMS-ContentManager

## 📋 METADATA
- **Nombre**: CMS Content Manager para ArtGoMA
- **Versión**: 1.1
- **Fecha creación**: 26/01/2026
- **Última actualización**: 28/01/2026
- **Autor**: Rodolfo + Claude
- **Estado**: ✅ Fases 1-3 COMPLETADAS (85%) - Solo falta Fase 4 Polish

---

## 🎯 OBJETIVO

Crear un **CMS (Content Management System)** elegante y usable para gestionar todo el contenido dinámico de la web ArtGoMA, con arquitectura **template-ready** para reutilizar en otros proyectos.

### Visión
> "Un panel admin bonito que Karen pueda usar sin ser developer, nada parecido a WordPress"

---

## 🔥 PROBLEMA ACTUAL

### Contenido Hardcodeado en JSON/Código:

| Contenido | Ubicación Actual | Problema |
|-----------|------------------|----------|
| Videos carousel | `histories.json` (12 videos MP4 en Supabase) | Subir videos = costos storage |
| Artistas carousel | `imgs-artists.json` (9 artistas) | Cambiar requiere git push |
| Brands/Sponsors | `useCarouselBrands.js` (10 logos) | Hardcodeado en código |
| Imágenes live | `slides.json` (6 imágenes) | JSON estático |
| Textos secciones | `dictionaries/*.json` (6 idiomas) | Editar requiere deploy |
| Contacto/Footer | Hardcodeado en componentes | Imposible editar sin código |

### Dolor Real:
- Karen no puede actualizar contenido sin Rodolfo
- Cambiar un video = subir a Supabase + editar JSON + git push + deploy
- Sin preview de cambios
- Sin historial de ediciones

---

## 💡 SOLUCIÓN PROPUESTA

### CMS con 4 módulos principales:

```
┌─────────────────────────────────────────────────────────┐
│                    ADMIN PANEL (/admin)                  │
│  Login: kl@roka.es / Test1234 (hardcodeado temporal)    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   SLIDERS   │  │   TEXTOS    │  │   CONFIG    │     │
│  │             │  │             │  │             │     │
│  │ • Videos    │  │ • Hero      │  │ • Contacto  │     │
│  │ • Artistas  │  │ • Connect   │  │ • Footer    │     │
│  │ • Brands    │  │ • Inspire   │  │ • Redes     │     │
│  │ • Live      │  │ • Location  │  │ • Metadata  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ ARQUITECTURA DE BASE DE DATOS

### Modelos Prisma (Template-Ready):

```prisma
// ============================================
// SLIDER SYSTEM (Genérico y reutilizable)
// ============================================

model Slider {
  id          Int      @id @default(autoincrement())
  name        String   // "Videos Historias", "Artistas", etc.
  slug        String   @unique // "videos-stories", "artists", etc.
  section     String   // "hero", "stories", "artists", "brands", "live"
  description String?
  isActive    Boolean  @default(true)
  position    Int      @default(0) // Orden en la página
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  items       SliderItem[]
}

model SliderItem {
  id          Int      @id @default(autoincrement())
  sliderId    Int
  
  // Tipo de contenido
  type        String   // "youtube" | "image" | "video_url"
  
  // Contenido según tipo
  url         String?  // URL de imagen o video externo
  youtubeId   String?  // ID de YouTube (ej: "dQw4w9WgXcQ")
  
  // Metadata
  title       String?
  alt         String?
  artistName  String?  // Para carousel de artistas
  
  // Dimensiones (opcionales)
  width       Int?
  height      Int?
  
  // Control
  position    Int      @default(0)
  isActive    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  Slider      Slider   @relation(fields: [sliderId], references: [id], onDelete: Cascade)
}

// ============================================
// SECTION CONTENT (Textos multiidioma)
// ============================================

model SectionContent {
  id          Int      @id @default(autoincrement())
  sectionKey  String   // "hero", "connect", "inspire", "location", "getInTouch", "welcomePage"
  locale      String   // "es", "en", "de", "fr", "it", "ru"
  
  // Contenido JSON flexible
  content     Json     // { h1: "...", h2: "...", paragraphs: [...], buttons: {...} }
  
  isActive    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([sectionKey, locale]) // Una entrada por sección+idioma
}

// ============================================
// SITE CONFIG (Contacto, Footer, Redes)
// ============================================

model SiteConfig {
  id          Int      @id @default(autoincrement())
  key         String   @unique // "phone", "email", "address", "facebook", "instagram", etc.
  value       String
  type        String   @default("text") // "text" | "url" | "image" | "email" | "phone"
  group       String   @default("general") // "contact", "social", "footer", "meta"
  label       String?  // Label para mostrar en admin
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 🔗 **Cross-ref**: tasks.md Fase 1, Tarea 1.1

---

## 📐 REQUIREMENTS

### REQ-01: Sistema de Sliders Dinámicos [MVP]
**Descripción**: CRUD completo para gestionar sliders y sus items
**Criterios de aceptación**:
- [x] Crear/Editar/Eliminar sliders ✅ (slider.ts + SliderCard + CreateSliderDialog)
- [x] Drag & drop para reordenar items ✅ (SliderItemsList.tsx con HTML5 nativo)
- [x] Soporte para YouTube (solo pegar URL/ID) ✅ (youtube.ts + AddItemDialog)
- [x] Soporte para imágenes (URL o upload a Supabase) ✅ (AddItemDialog + EditItemDialog)
- [x] Preview en tiempo real ✅ (thumbnails en dialogs)
- [x] Activar/Desactivar items sin eliminar ✅ (toggle con rollback - 28/01/2026)

**🔗 Implementation**: tasks.md Fase 1

---

### REQ-02: Integración YouTube [MVP]
**Descripción**: Videos desde YouTube en lugar de Supabase storage
**Criterios de aceptación**:
- [x] Pegar URL de YouTube → extrae ID automáticamente ✅ (youtube.ts extractYouTubeId)
- [x] Preview del video en el admin ✅ (thumbnail en AddItemDialog/EditItemDialog)
- [x] Soporte para videos unlisted ✅ (funciona con cualquier ID válido)
- [x] Thumbnail automático desde YouTube ✅ (getYouTubeThumbnail)
- [x] Embed responsive en frontend ✅ (YouTubeEmbed.tsx con lite mode)

**Beneficios**:
- ✅ CDN global gratis (YouTube)
- ✅ Sin costos de storage
- ✅ Compression automática
- ✅ Streaming optimizado

**🔗 Implementation**: tasks.md Fase 1, Tarea 1.3

---

### REQ-03: Gestión de Textos Multiidioma [MVP]
**Descripción**: Editar textos de secciones en todos los idiomas
**Criterios de aceptación**:
- [x] Editor para cada sección (hero, connect, inspire, etc.) ✅ (ContentEditorClient + SectionEditor)
- [x] Tabs o selector de idioma (ES, EN, DE, FR, IT, RU) ✅ (LocaleTabs.tsx)
- [x] Campos según estructura actual (h1, h2, paragraphs, buttons) ✅ (sectionSchemas.ts)
- [ ] Preview del texto formateado (pendiente - mejora futura)
- [x] Fallback a español si no existe traducción ✅ (dictionary.ts merge con JSON)

**🔗 Implementation**: tasks.md Fase 2

---

### REQ-04: Configuración del Sitio [MVP]
**Descripción**: Gestionar contacto, footer y redes sociales
**Criterios de aceptación**:
- [x] Editar teléfono, email, dirección ✅ (ConfigGroup.tsx + config.ts)
- [x] Editar links de redes sociales ✅ (facebook, instagram, youtube, twitter)
- [x] Editar copyright/año del footer ✅ (grupo footer en settings)
- [x] Agrupación lógica en el admin (Contacto, Redes, Footer) ✅ (3 grupos colapsables)

**🔗 Implementation**: tasks.md Fase 3

---

### REQ-05: UI/UX del Panel Admin [MVP]
**Descripción**: Interfaz bonita, moderna y usable
**Criterios de aceptación**:
- [x] Design system consistente (colores ArtGoMA: rojo, negro, blanco) ✅ (#1c1f24, #2a2d35, #dc2626)
- [ ] Responsive (funciona en tablet/móvil) (pendiente - sidebar colapsable)
- [x] Feedback visual en acciones (loading, success, error) ✅ (estados en todos los forms)
- [x] Navegación clara entre módulos ✅ (Sidebar.tsx con iconos)
- [x] Iconografía consistente (Lucide icons) ✅ (usado en todo el admin)

**Inspiración**:
- Notion (simplicidad)
- Linear (estética)
- NO WordPress (complejidad innecesaria)

**🔗 Implementation**: tasks.md Fase 1-3 (transversal)

---

### REQ-06: Autenticación Temporal [MVP]
**Descripción**: Login hardcodeado para fase inicial
**Criterios de aceptación**:
- [x] Ruta `/admin` protegida ✅ (layout.tsx con auth check)
- [x] Login con email: `kl@roka.es` y password: `Test1234` ✅ (auth.ts)
- [ ] Middleware que verifica sesión (opcional - ya hay check en layout)
- [x] Logout funcional ✅ (Header.tsx + actions/auth.ts)
- [x] Redirect a login si no autenticado ✅ (layout.tsx redirect)

**Nota**: Después se integrará con NextAuth cuando esté todo probado

**🔗 Implementation**: tasks.md Fase 1, Tarea 1.2

---

### REQ-07: Integración con Frontend Existente [B]
**Descripción**: Reemplazar JSONs hardcodeados por queries a BD
**Criterios de aceptación**:
- [x] Carousel de videos usa datos de BD (con YouTube) ✅ Carousel2 + YouTubeEmbed
- [x] Carousel de artistas usa datos de BD ✅ ArtistsCarousel
- [x] Carousel de brands usa datos de BD ✅ LogoCarousel
- [x] Carousel de live usa datos de BD ✅ Carousel (sections)
- [x] Hero Carousel usa datos de BD ✅ HeroCarousel (27/01/2026)
- [x] Golden Tickets carousel usa datos de BD ✅ GoldenTicketsCarousel (27/01/2026)
- [x] Textos de secciones vienen de BD (con fallback a JSON) ✅ dictionary.ts (26/01/2026)
- [x] Contacto/Footer desde SiteConfig ✅ Footer.tsx + GetInTouch.tsx (26/01/2026)
- [x] Cache con revalidación (ISR o similar) ✅ unstable_cache 60s/300s + revalidateTag

**🔗 Implementation**: tasks.md Fase 1.9, 2.4, 3.3

---

### REQ-08: Arquitectura Template-Ready [OPT]
**Descripción**: Diseño reutilizable para otros proyectos
**Criterios de aceptación**:
- [x] Schema de BD genérico (section, sectionKey, etc.) ✅ (Slider, SliderItem, SectionContent, SiteConfig)
- [ ] Componentes admin desacoplados (pendiente refactor)
- [ ] Configuración por variables de entorno (pendiente)
- [ ] Documentación de cómo reutilizar (pendiente)

**🔗 Implementation**: tasks.md Fase 4

---

### REQ-09: Upload de Imágenes a Supabase [MVP] (NUEVO)
**Descripción**: Subir imágenes directamente desde el admin a Supabase Storage
**Criterios de aceptación**:
- [x] AddItemDialog permite subir imagen nueva ✅ (tabs URL/Upload - 27/01/2026)
- [x] EditItemDialog permite subir imagen nueva ✅ (sección "o subir nueva" - 27/01/2026)
- [x] Validación de tipo (PNG/JPG/WebP) ✅ (client-side)
- [x] Validación de tamaño (max 4-5MB) ✅ (client-side)
- [x] Preview local antes de subir ✅ (objectURL)
- [x] API endpoint funcional ✅ (/api/upload-images con bucket: events)
- [x] Cache invalidation después de agregar items ✅ (revalidateTag("sliders") - 28/01/2026)

**🔗 Implementation**: tasks.md (no estaba planificado, fue feature emergente)

---

### REQ-10: Appearance Config (Fonts + Colores) [MVP] (NUEVO)
**Descripción**: Sistema configurable de tipografías y colores desde admin panel
**Fecha creación**: 28/01/2026
**Motivación**: 92+ colores hardcodeados en código, font única no transmite lujo artístico

**Criterios de aceptación**:
- [x] Colores hardcoded migrados a CSS variables ✅ (Tarea 5.1 - Agente Opus)
- [x] Font Display (serif) agregada para títulos ✅ (Tarea 5.2 - Cormorant Garamond)
- [x] Admin panel grupo "Appearance" con: ✅ (Tarea 5.3)
  - [x] Color pickers para bg_primary, bg_surface, bg_input, accent_color, bg_footer ✅
  - [x] Dropdown para font_display (Cormorant/Playfair/DM Serif) ✅
  - [x] Dropdown para font_body (Montserrat/Inter/Roboto) ✅
- [x] RootLayout inyecta CSS variables desde BD en runtime ✅ (Tarea 5.4)
- [x] Seed con valores actuales como default ✅ (7 configs appearance en BD)
- [x] Cache invalidation para appearance configs ✅ (revalidateTag("appearance"))

**Colores a configurar**:
- `bg_primary`: #1c1f24 (39 ocurrencias)
- `bg_surface`: #2a2d35 (13 ocurrencias)
- `bg_input`: #0f1115 (15 ocurrencias)
- `accent_color`: #dc2626 (rojo ArtGoMA)
- `bg_footer`: #000000 (footer)

**Fonts a configurar**:
- Display (títulos H1/H2): Cormorant Garamond, Playfair Display, DM Serif Display
- Body (textos/UI): Montserrat, Inter, Roboto

**Beneficios**:
- ✅ Karen cambia colores sin Rodolfo
- ✅ Tipografía más sofisticada y artística
- ✅ Reutilizable para otros proyectos
- ✅ Preview inmediato de cambios

**🔗 Implementation**: tasks.md Fase 5

---

## 📁 FILE STRUCTURE (🔴 MANTENER ACTUALIZADA)

**Last Updated:** 28/01/2026 - Sincronizado con work_prepend.md

### ✅ Ya Creados:

```
src/
├── lib/
│   └── cms/
│       ├── youtube.ts                ✅ Utilidades YouTube (extraer ID, thumbnail, embed)
│       ├── auth.ts                   ✅ Auth temporal (kl@roka.es / Test1234)
│       └── sectionSchemas.ts         ✅ Schemas Zod + tipos (10 secciones)
│
├── actions/
│   └── cms/
│       ├── auth.ts                   ✅ Server actions login/logout
│       ├── slider.ts                 ✅ Server actions CRUD sliders + revalidateTag (fix 28/01)
│       ├── content.ts                ✅ Server actions CRUD contenido + invalidación 3 tags (fix 28/01)
│       └── config.ts                 ✅ Server actions CRUD config sitio
│
├── queries/
│   └── cms/
│       ├── index.ts                  ✅ Barrel export de todas las queries
│       ├── getSliders.ts             ✅ Queries sliders (cache 60s, tags: sliders)
│       ├── getSectionContent.ts      ✅ Queries contenido (cache 300s, tags: section-content)
│       └── getSiteConfig.ts          ✅ Queries config sitio (cache 300s, tags: cms-config)
│
├── configs/
│   └── dictionary.ts                 ✅ getDictionary con BD + fallback JSON (fix 28/01)
│
├── app/
│   ├── api/
│   │   ├── upload-images/
│   │   │   └── route.ts              ✅ Upload a Supabase Storage (bucket: events)
│   │   └── debug-supabase/
│   │       └── route.ts              ✅ Endpoint temporal debug (27/01)
│   │
│   └── [lang]/
│       └── admin/
│           ├── layout.tsx            ✅ Layout con auth check
│           ├── page.tsx              ✅ Dashboard con stats
│           ├── login/
│           │   └── page.tsx          ✅ Página login UI
│           ├── components/
│           │   ├── Sidebar.tsx       ✅ Navegación lateral
│           │   └── Header.tsx        ✅ Header con logout
│           ├── sliders/
│           │   ├── page.tsx          ✅ Lista de sliders
│           │   ├── [id]/
│           │   │   └── page.tsx      ✅ Editor slider con drag&drop
│           │   └── components/
│           │       ├── SliderCard.tsx           ✅ Card de slider
│           │       ├── CreateSliderDialog.tsx   ✅ Dialog crear slider
│           │       ├── SliderItemsList.tsx      ✅ Lista items drag&drop + toggle rollback
│           │       ├── AddItemDialog.tsx        ✅ Dialog agregar (YouTube/URL/Upload)
│           │       ├── EditItemDialog.tsx       ✅ Dialog editar + upload imagen
│           │       └── SliderSettings.tsx       ✅ Dropdown settings slider
│           ├── content/
│           │   ├── page.tsx                     ✅ Editor contenido multiidioma
│           │   └── components/
│           │       ├── ContentEditorClient.tsx  ✅ Cliente orquestador
│           │       ├── LocaleTabs.tsx           ✅ Tabs de idiomas
│           │       └── SectionEditor.tsx        ✅ Formulario dinámico
│           └── settings/
│               ├── page.tsx                     ✅ Configuración sitio
│               └── components/
│                   └── ConfigGroup.tsx          ✅ Grupo colapsable
```

### 🔄 Ya Modificados:

```
prisma/
└── schema.prisma                     ✅ +4 modelos CMS (Slider, SliderItem, SectionContent, SiteConfig)
```

### ✅ Ya Creados (Seeds - Fase 2.5 + 3.4):

```
prisma/seeds/
├── seed.ts                           ✅ Script principal (ejecuta todos los seeds)
├── seed-content.ts                   ✅ Migra dictionaries/*.json → SectionContent
├── seed-config.ts                    ✅ Inserta configs (contacto, redes, footer)
└── seed-sliders.ts                   ✅ Migra JSONs → Slider + SliderItem
```

**Scripts npm agregados:**
- `npm run db:seed` - Ejecuta todos los seeds
- `npm run db:seed:content` - Solo contenido multiidioma
- `npm run db:seed:config` - Solo configuracion sitio
- `npm run db:seed:sliders` - Solo sliders

### ✅ Ya Creados (19:25 - Editor Slider):

```
src/app/[lang]/admin/sliders/
├── [id]/
│   └── page.tsx                      ✅ Editor slider con header, stats, integración
└── components/
    ├── SliderItemsList.tsx           ✅ Lista items drag&drop HTML5 nativo
    ├── AddItemDialog.tsx             ✅ Dialog agregar item (tabs YouTube/Imagen)
    ├── EditItemDialog.tsx            ✅ Dialog editar item
    └── SliderSettings.tsx            ✅ Dropdown: editar nombre, toggle, eliminar
```

### ✅ Ya Creados (21:00 - Editor Contenido Multiidioma):

```
src/app/[lang]/admin/content/
├── page.tsx                          ✅ Página principal editor de contenido
└── components/
    ├── ContentEditorClient.tsx       ✅ Cliente orquestador (selector sección + locale)
    ├── LocaleTabs.tsx                ✅ Tabs de idiomas con indicador de traducción
    └── SectionEditor.tsx             ✅ Formulario dinámico por sección
```

### ✅ Ya Creados (21:30 - Settings Config Sitio):

```
src/app/[lang]/admin/settings/
├── page.tsx                          ✅ Configuración del sitio (Contacto, Redes, Footer)
└── components/
    └── ConfigGroup.tsx               ✅ Grupo de configs colapsable con validación
```

### ⬜ Por Crear (Fase 4 - Polish):

```
- Template-ready refactor
- Preview/Draft mode
- Testing & QA completo
```

### ✅ Ya Modificados (Fase 1.9 - Integración Frontend Carousels):

```
src/app/[lang]/components/
├── YouTubeEmbed.tsx                  ✅ Componente YouTube embed responsive (lite mode)
├── sections/
│   ├── hero/
│   │   ├── Hero.tsx                  ✅ Modificado para usar HeroCarousel
│   │   ├── HeroCarousel.tsx          ✅ Server component con getSliderBySection("hero")
│   │   ├── HeroCarouselClient.tsx    ✅ Cliente con rotación automática 7s
│   │   └── index.tsx                 ✅ Re-export + tipos
│   ├── carousel2/
│   │   ├── Carousel2.tsx             ✅ Server component con getSliderBySection("stories")
│   │   ├── EmblaCarousel2.tsx        ✅ Soporte YouTube + video MP4
│   │   └── index.tsx                 ✅ Re-export + tipos
│   ├── carousel/
│   │   ├── Carousel.tsx              ✅ Server component con getSliderBySection("live")
│   │   ├── EmblaCarousel.tsx         ✅ Actualizado + playOnInit fix (27/01)
│   │   └── index.tsx                 ✅ Re-export + tipos
│   ├── footer/
│   │   └── Footer.tsx                ✅ Async server component + BD (26/01)
│   └── getInTouch/
│       └── GetInTouch.tsx            ✅ Usa getContactInfo() + BD (26/01)
├── carousel/
│   ├── index.tsx                     ✅ Re-export LogoCarousel
│   ├── LogoCarousel.tsx              ✅ Server component con getSliderBySection("brands")
│   └── LogoCarouselClient.tsx        ✅ Cliente con animación loop
├── carousel2/
│   ├── ArtistsCarousel.tsx           ✅ Server component con getSliderBySection("artists")
│   └── ArtistsCarouselClient.tsx     ✅ Cliente Embla carousel
└── carousel-tickets/
    ├── index.tsx                     ✅ Re-export (27/01)
    ├── GoldenTicketsCarousel.tsx     ✅ Server component con getSliderBySection("tickets")
    └── GoldenTicketsCarouselClient.tsx ✅ Cliente CSS scroll infinito
```

**Fallbacks implementados (6 carousels):**
- HeroCarousel (hero) → imgsCarousel.json
- Carousel2 (stories) → histories.json
- ArtistsCarousel (artists) → imgs-artists.json
- LogoCarousel (brands) → useCarouselBrands.js
- Carousel (live) → slides.json
- GoldenTicketsCarousel (tickets) → useCarouselGoldenTickets.js

---

## 🎨 DISEÑO UI/UX

### Paleta de Colores (ArtGoMA):
```css
--primary: #dc2626;     /* Rojo ArtGoMA */
--background: #1c1f24;  /* Fondo oscuro */
--surface: #2a2d35;     /* Cards/superficies */
--text: #ffffff;        /* Texto principal */
--text-muted: #9ca3af;  /* Texto secundario */
--border: #374151;      /* Bordes */
--success: #22c55e;     /* Éxito */
--error: #ef4444;       /* Error */
```

### Componentes UI a Usar:
- shadcn/ui existentes (Button, Dialog, Select, etc.)
- Lucide icons (ya instalado)
- Framer Motion para animaciones sutiles

### Layout Admin:
```
┌──────────────────────────────────────────────────┐
│  🎨 ArtGoMA Admin          [User] [Logout]       │
├─────────┬────────────────────────────────────────┤
│         │                                         │
│  📊     │   CONTENIDO PRINCIPAL                  │
│  Dashboard                                        │
│         │   • Formularios                        │
│  🎬     │   • Listas                             │
│  Sliders│   • Previews                           │
│         │                                         │
│  📝     │                                         │
│  Textos │                                         │
│         │                                         │
│  ⚙️     │                                         │
│  Config │                                         │
│         │                                         │
└─────────┴────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE DATOS

### Slider con YouTube:

```
ADMIN                           FRONTEND
  │                                │
  ├─ Pega URL YouTube ────────────►│
  │  "youtube.com/watch?v=ABC123"  │
  │                                │
  ├─ Extrae ID: "ABC123" ─────────►│
  │                                │
  ├─ Guarda en BD ────────────────►│
  │  { type: "youtube",            │
  │    youtubeId: "ABC123" }       │
  │                                │
  │                      Query ◄───┤
  │                                │
  │                      Render ◄──┤
  │                      <iframe   │
  │                       src=     │
  │                       "embed/  │
  │                        ABC123">│
```

### Textos Multiidioma:

```
ADMIN                           FRONTEND
  │                                │
  ├─ Edita texto ES ──────────────►│
  │  { h1: "EXPERIENCIA ÚNICA" }   │
  │                                │
  ├─ Guarda en BD ────────────────►│
  │  sectionKey: "hero"            │
  │  locale: "es"                  │
  │                                │
  │              Query con lang ◄──┤
  │              getSectionContent │
  │              ("hero", "es")    │
  │                                │
  │              Render ◄──────────┤
  │              <H1hero text=     │
  │               {content.h1} />  │
```

---

## ⚠️ CONSIDERACIONES TÉCNICAS

### Cache Strategy:
- **ISR (Incremental Static Regeneration)** para contenido
- `revalidate: 60` (1 minuto) en queries de sliders
- `revalidate: 300` (5 minutos) en textos (cambian menos)
- Opción manual de "Purge cache" en admin (futuro)

### YouTube Embed:
```tsx
// Patrón de URL a soportar:
// https://www.youtube.com/watch?v=VIDEO_ID
// https://youtu.be/VIDEO_ID
// https://www.youtube.com/embed/VIDEO_ID

// Extraer ID con regex:
const extractYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
```

### Fallback Strategy:
```typescript
// Si no hay contenido en BD, usar JSON existente
const content = await getSectionContent("hero", lang) 
  ?? dictionaries[lang].hero;
```

---

## 📊 MÉTRICAS DE ÉXITO

| Métrica | Objetivo |
|---------|----------|
| Karen puede editar slider | ✅ Sin ayuda de Rodolfo |
| Tiempo para cambiar video | < 1 minuto (vs 10+ min actual) |
| Costo storage videos | $0 (YouTube) |
| UI admin usable | Karen dice "qué bonito" |
| Template reutilizable | Funciona en proyecto X |

---

## 🚀 FASES DE IMPLEMENTACIÓN

| Fase | Contenido | Estado | Progreso |
|------|-----------|--------|----------|
| **1. MVP Sliders** | DB + Admin Sliders + YouTube + Upload | ✅ COMPLETADA | 8/8 |
| **2. Textos** | SectionContent + Editor multiidioma | ✅ COMPLETADA | 5/5 |
| **3. Config** | SiteConfig + Contacto/Footer | ✅ COMPLETADA | 4/4 |
| **4. Polish** | Template-ready + Docs | ⬜ PENDIENTE | 0/3 |

**Total progreso**: 17/20 tareas (85%)

**BONUS implementados** (no planificados):
- ✅ Hero Carousel integrado con BD
- ✅ Golden Tickets carousel integrado con BD
- ✅ Upload de imágenes a Supabase (REQ-09)
- ✅ Fix AutoScroll "DISFRUTA EN VIVO"
- ✅ Fix toggle items con rollback
- ✅ Fix cache invalidation (revalidateTag)
- ✅ Fix textos multiidioma (28/01/2026)

**🔗 Detalle**: Ver tasks.md para breakdown completo

---

## 📝 DECISIONES TÉCNICAS

### ¿Por qué YouTube en lugar de Supabase para videos?
- **Costo**: $0 vs ~$0.02/GB en Supabase
- **CDN**: YouTube tiene el mejor CDN del mundo
- **Compression**: Automática y optimizada
- **Streaming**: Adaptive bitrate gratis
- **Mantenimiento**: Cero

### ¿Por qué login hardcodeado inicial?
- Validar todo el CMS funciona primero
- Evitar complejidad de auth mientras desarrollamos
- Fácil de reemplazar después con NextAuth

### ¿Por qué JSON flexible en SectionContent?
- Cada sección tiene estructura diferente
- Evita crear tabla por sección
- Fácil de extender sin migrations

---

**📋 SPEC**: SPEC-26-01-2026-CMS-ContentManager
**🔗 Tasks**: tasks.md
**📊 Status**: work_prepend.md
