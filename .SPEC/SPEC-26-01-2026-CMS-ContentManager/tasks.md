# TASKS - SPEC-26-01-2026-CMS-ContentManager

## 📋 METADATA
- **SPEC**: CMS Content Manager para ArtGoMA
- **Última actualización**: 28/01/2026 (Sincronizado con spec.md)
- **Estado global**: ✅ Fases 1-3 COMPLETADAS (85%) - Solo falta Fase 4 Polish

---

## 📊 RESUMEN DE PROGRESO

| Fase | Nombre | Estado | Progreso |
|------|--------|--------|----------|
| 1 | MVP Sliders + YouTube | ✅ | 8/8 + 9 fixes |
| 2 | Textos Multiidioma | ✅ | 5/5 + 1 fix cache |
| 3 | Config Sitio | ✅ | 4/4 |
| 4 | Polish & Template | ⬜ | 0/3 |

**Total**: 17/20 tareas principales + 10 fixes/mejoras (27-28/01/2026)
**Estado**: Pendiente verificacion de Rodolfo antes de marcar 100%

**BONUS**: Seed de Sliders creado (seed-sliders.ts) con datos de:
- histories.json (12 videos stories + 2 YouTube)
- imgs-artists.json (9 artistas)
- slides.json (11 items live gallery)
- useCarouselBrands.js (5 logos unicos)
- imgsCarousel.json (6 imagenes hero)
- useCarouselGoldenTickets.js (5 tickets)

**FIXES 27-28/01/2026**:
- [x] Toggle items slider con rollback (SliderItemsList.tsx)
- [x] Upload imagenes en AddItemDialog (tabs URL/Upload)
- [x] Upload imagenes en EditItemDialog (seccion upload)
- [x] Cache invalidation con revalidateTag("sliders") en slider.ts
- [x] Cache invalidation textos multiidioma (3 tags: cms-content, section-content, dictionary)
- [x] AutoScroll carousel "DISFRUTA EN VIVO" (playOnInit: true)
- [x] Hero Carousel integrado con BD (HeroCarousel.tsx + HeroCarouselClient.tsx)
- [x] Golden Tickets carousel integrado (GoldenTicketsCarousel.tsx + Client)
- [x] Migracion BD produccion ejecutada (prisma migrate deploy + seeds)

---

## 🔥 FASE 1: MVP SLIDERS + YOUTUBE [MVP]

> **Objetivo**: Sistema completo de sliders con soporte YouTube
> **Estimación total**: 2-3 días
> **🔗 Spec ref**: REQ-01, REQ-02, REQ-06

### 1.1 ✅ Schema Prisma - Modelos CMS [B] ⏱️ 30min
**Descripción**: Agregar modelos Slider, SliderItem, SectionContent, SiteConfig al schema
**Archivos**:
- `prisma/schema.prisma` ✅ (modificado)

**Subtareas**:
- [x] Agregar modelo Slider
- [x] Agregar modelo SliderItem (con type: youtube|image|video_url)
- [x] Agregar modelo SectionContent
- [x] Agregar modelo SiteConfig
- [x] ✅ Ejecutar `npx prisma migrate deploy` (27/01/2026)
- [x] Verificar en BD que se crearon las tablas (27/01/2026 - 6 sliders, 48 items)
- [x] ✅ BD produccion lista (28/01/2026 - 6 sliders, 14 items stories con YouTube)

**🔗 Spec ref**: spec.md → Arquitectura de Base de Datos
**📊 Status**: work_prepend.md → 26/01/2026 18:30

---

### 1.2 ✅ Auth Temporal Hardcodeada [B] ⏱️ 45min
**Descripción**: Sistema de login simple para proteger /admin
**Archivos**:
- `src/lib/cms/auth.ts` ✅ (creado)
- `src/actions/cms/auth.ts` ✅ (creado)
- `src/app/[lang]/admin/login/page.tsx` ✅ (creado)

**Subtareas**:
- [x] Crear función `validateAdminCredentials(email, password)`
- [x] Crear página de login con form bonito
- [x] Crear cookie de sesión simple (no JWT, solo para dev)
- [x] Crear botón de logout
- [ ] Modificar middleware para proteger `/admin/*` (opcional, ya hay check en layout)
- [ ] Probar flujo completo: login → admin → logout

**Credenciales**: `kl@roka.es` / `Test1234`

**🔗 Spec ref**: REQ-06
**📊 Status**: work_prepend.md → 26/01/2026 18:30

---

### 1.3 🔄 Layout Admin + Navegación [MVP] ⏱️ 1h
**Descripción**: Layout base con sidebar para el panel admin
**Archivos**:
- `src/app/[lang]/admin/layout.tsx` ✅ (creado)
- `src/app/[lang]/admin/page.tsx` ✅ (creado - dashboard)
- `src/app/[lang]/admin/components/Sidebar.tsx` ✅ (creado)
- `src/app/[lang]/admin/components/Header.tsx` ✅ (creado)

**Subtareas**:
- [x] Crear layout con sidebar (iconos: Dashboard, Sliders, Textos, Config)
- [x] Implementar Header con logo y botón logout
- [x] Dashboard con cards de resumen (# sliders, # secciones)
- [x] Navegación activa según ruta actual
- [ ] Responsive: sidebar colapsable en móvil (mejora futura)

**Diseño**: Tema oscuro (#1c1f24), acentos rojos (#dc2626)

**🔗 Spec ref**: REQ-05
**📊 Status**: work_prepend.md → 26/01/2026 18:30

---

### 1.4 ✅ Server Actions - Sliders CRUD [MVP] ⏱️ 1h
**Descripción**: Acciones del servidor para gestionar sliders
**Archivos**:
- `src/actions/cms/slider.ts` ✅ (creado)

**Subtareas**:
- [x] `getSliders()` - Listar todos los sliders
- [x] `getSliderById(id)` - Obtener slider con items
- [x] `createSlider(data)` - Crear nuevo slider
- [x] `updateSlider(id, data)` - Actualizar slider
- [x] `deleteSlider(id)` - Eliminar slider (cascade items)
- [x] `createSliderItem(sliderId, data)` - Agregar item
- [x] `updateSliderItem(id, data)` - Actualizar item
- [x] `deleteSliderItem(id)` - Eliminar item
- [x] `reorderSliderItems(sliderId, itemIds[])` - Reordenar
- [x] Validación con Zod en todas las acciones

**🔗 Spec ref**: REQ-01
**📊 Status**: work_prepend.md → 26/01/2026 18:30

---

### 1.5 ✅ Utilidades YouTube [MVP] ⏱️ 30min
**Descripción**: Helpers para trabajar con URLs de YouTube
**Archivos**:
- `src/lib/cms/youtube.ts` ✅ (creado)

**Subtareas**:
- [x] `extractYouTubeId(url)` - Extrae ID de cualquier formato URL
- [x] `getYouTubeThumbnail(id)` - Retorna URL de thumbnail
- [x] `getYouTubeEmbedUrl(id)` - Retorna URL para iframe
- [x] `isValidYouTubeUrl(url)` - Validación
- [ ] Tests unitarios básicos (opcional)

**Formatos soportados**:
```
https://www.youtube.com/watch?v=VIDEO_ID ✅
https://youtu.be/VIDEO_ID ✅
https://www.youtube.com/embed/VIDEO_ID ✅
VIDEO_ID directo ✅
```

**🔗 Spec ref**: REQ-02
**📊 Status**: work_prepend.md → 26/01/2026 18:30

---

### 1.6 🔄 UI Admin - Lista de Sliders [MVP] ⏱️ 1h
**Descripción**: Página para ver y gestionar sliders
**Archivos**:
- `src/app/[lang]/admin/sliders/page.tsx` ✅ (creado)
- `src/app/[lang]/admin/sliders/components/SliderCard.tsx` ✅ (creado)
- `src/app/[lang]/admin/sliders/components/CreateSliderDialog.tsx` ✅ (creado)

**Subtareas**:
- [x] Grid de cards con sliders existentes
- [x] Card muestra: nombre, sección, # items, estado (activo/inactivo)
- [x] Botón "Nuevo Slider" abre modal/dialog
- [x] Click en card → navega a editor
- [x] Toggle activar/desactivar slider
- [x] Botón eliminar con confirmación
- [x] Toggle activo/desactivar con rollback en error (28/01/2026)
- [ ] Empty state bonito si no hay sliders (mejora)

**🔗 Spec ref**: REQ-01, REQ-05
**📊 Status**: work_prepend.md → 26/01/2026 18:30

---

### 1.7 ✅ UI Admin - Editor de Slider [MVP] ⏱️ 2h
**Descripción**: Página para editar slider y sus items
**Archivos**:
- `src/app/[lang]/admin/sliders/[id]/page.tsx` ✅ (creado)
- `src/app/[lang]/admin/sliders/components/SliderItemsList.tsx` ✅ (creado)
- `src/app/[lang]/admin/sliders/components/AddItemDialog.tsx` ✅ (creado)
- `src/app/[lang]/admin/sliders/components/EditItemDialog.tsx` ✅ (creado)
- `src/app/[lang]/admin/sliders/components/SliderSettings.tsx` ✅ (creado)

**Subtareas**:
- [x] Header con nombre del slider y stats
- [x] Grid/Lista de items con drag & drop HTML5 nativo para reordenar
- [x] Item card muestra: thumbnail, título, tipo (YouTube/imagen)
- [x] Botón "Agregar Item" abre dialog
- [x] Dialog con tabs: YouTube | Imagen
- [x] Para YouTube: input URL → extracción automática ID → preview
- [x] Para imagen: input URL
- [x] Editar item en dialog (EditItemDialog)
- [x] Eliminar item con confirmación
- [x] Optimistic updates en reordenamiento
- [x] SliderSettings dropdown (editar nombre, toggle, eliminar)
- [x] Upload imagen directo a Supabase en AddItemDialog (27/01/2026)
- [x] Upload imagen directo a Supabase en EditItemDialog (27/01/2026)
- [x] Toggle items con rollback en error + spinner + banner error (28/01/2026)

**Características implementadas:**
- Drag & drop HTML5 nativo (sin librerías)
- Extracción automática YouTube ID (watch?v=, youtu.be/, embed/)
- Optimistic updates
- Colores SPEC: #1c1f24, #2a2d35, #dc2626

**🔗 Spec ref**: REQ-01, REQ-02, REQ-05
**📊 Status**: work_prepend.md → 26/01/2026 19:25

---

### 1.8 ✅ Queries Frontend - Sliders/Content/Config [B] ⏱️ 1h
**Descripción**: Queries con cache ISR para el frontend
**Archivos**:
- `src/queries/cms/getSliders.ts` ✅ (creado)
- `src/queries/cms/getSectionContent.ts` ✅ (creado)
- `src/queries/cms/getSiteConfig.ts` ✅ (creado)
- `src/queries/cms/index.ts` ✅ (creado - barrel export)

**Subtareas**:
- [x] Crear query `getSliderBySection(section)` con cache 60s
- [x] Crear query `getSliderBySlug(slug)` con cache 60s
- [x] Crear query `getAllSliders()` con cache 60s
- [x] Crear query `getSliderById(id)` con cache 60s
- [x] Crear query `getSectionContent(sectionKey, locale)` con cache 300s
- [x] Crear query `getSectionContentAllLocales(sectionKey)`
- [x] Crear query `getConfigByGroup(group)` con cache 300s
- [x] Crear query `getConfigByKey(key)`
- [x] Crear helpers `getContactInfo()`, `getSocialLinks()`
- [x] Versiones sin cache para admin panel
- [x] Tags para invalidación: `cms-sliders`, `cms-content`, `cms-config`
- [x] Barrel export en index.ts

**🔗 Spec ref**: REQ-07
**📊 Status**: work_prepend.md → 26/01/2026 19:20

---

### 1.9 ✅ Integración Carousels - Usar Queries [P] ⏱️ 1h
**Descripción**: Modificar carousels del frontend para usar las queries de BD
**Archivos**:
- `src/app/[lang]/components/YouTubeEmbed.tsx` ✅ (creado)
- `src/app/[lang]/components/sections/carousel2/Carousel2.tsx` ✅ (modificado)
- `src/app/[lang]/components/sections/carousel2/EmblaCarousel2.tsx` ✅ (modificado)
- `src/app/[lang]/components/carousel2/ArtistsCarousel.tsx` ✅ (modificado)
- `src/app/[lang]/components/carousel2/ArtistsCarouselClient.tsx` ✅ (creado)
- `src/app/[lang]/components/carousel/index.tsx` ✅ (modificado)
- `src/app/[lang]/components/carousel/LogoCarousel.tsx` ✅ (creado)
- `src/app/[lang]/components/carousel/LogoCarouselClient.tsx` ✅ (creado)
- `src/app/[lang]/components/sections/carousel/Carousel.tsx` ✅ (modificado)
- `src/app/[lang]/components/sections/carousel/EmblaCarousel.tsx` ✅ (modificado)
- `src/app/[lang]/components/sections/hero/HeroCarousel.tsx` ✅ (creado 27/01)
- `src/app/[lang]/components/sections/hero/HeroCarouselClient.tsx` ✅ (creado 27/01)
- `src/app/[lang]/components/carousel-tickets/GoldenTicketsCarousel.tsx` ✅ (creado 27/01)
- `src/app/[lang]/components/carousel-tickets/GoldenTicketsCarouselClient.tsx` ✅ (creado 27/01)

**Subtareas**:
- [x] Modificar Carousel2 (videos) para usar getSliderBySection("stories")
- [x] Crear componente YouTube embed responsive (YouTubeEmbed.tsx con lite mode)
- [x] Modificar ArtistsCarousel para usar BD (server + client component)
- [x] Modificar LogoCarousel (brands) para usar BD (server + client component)
- [x] Modificar Carousel (live) para usar BD
- [x] Fallback a JSON si BD vacía (todos implementados)
- [x] Hero Carousel integrado con BD (HeroCarousel.tsx + HeroCarouselClient.tsx) (27/01/2026)
- [x] Golden Tickets carousel integrado (GoldenTicketsCarousel.tsx) (27/01/2026)
- [x] Fix AutoScroll "DISFRUTA EN VIVO" (playOnInit: true) (27/01/2026)
- [x] Cache invalidation con revalidateTag("sliders") en todas las mutaciones (28/01/2026)
- [ ] Verificar que todo renderiza igual (requiere prueba de Rodolfo)

**Características implementadas:**
- YouTubeEmbed con lite mode (thumbnail + click para cargar iframe)
- Soporte para aspectRatio: vertical, horizontal, square
- IntersectionObserver para autoplay cuando visible
- Server components que llaman getSliderBySection()
- Client components para Embla carousel (requiere "use client")
- Tipos TypeScript exportados: CarouselVideoItem, ArtistItem, BrandItem, CarouselSlideItem

**🔗 Spec ref**: REQ-07
**📊 Status**: work_prepend.md → 26/01/2026 22:00

---

## 📝 FASE 2: TEXTOS MULTIIDIOMA [MVP]

> **Objetivo**: Editor de textos por sección e idioma
> **Estimación total**: 1-2 días
> **🔗 Spec ref**: REQ-03

### 2.1 ✅ Server Actions - Content CRUD [MVP] ⏱️ 45min
**Descripción**: Acciones para gestionar contenido de secciones
**Archivos**:
- `src/actions/cms/content.ts` ✅ (creado)

**Subtareas**:
- [x] `getSectionContent(sectionKey, locale)` - Obtener contenido
- [x] `getSectionContentAllLocales(sectionKey)` - Todos los idiomas
- [x] `getAllSections()` - Listar secciones disponibles con sus locales
- [x] `getMultipleSections(keys, locale)` - Batch query
- [x] `upsertSectionContent(sectionKey, locale, content)` - Crear/Actualizar
- [x] `deleteSectionContent(id)` - Eliminar contenido
- [x] `toggleSectionContentActive(id)` - Toggle activo/inactivo
- [x] `copySectionContentToLocale(from, to)` - Copiar traducción
- [x] Validación con Zod (sectionKey, locale, content)
- [ ] Seed inicial con contenido de dictionaries/*.json (movido a 2.5)

**Funciones extra implementadas:**
- Constantes exportadas: `VALID_SECTIONS`, `VALID_LOCALES`
- Tipos exportados: `SectionKey`, `Locale`, `SectionContent`, `SectionWithLocales`
- Revalidación de cache con tags: `cms-content`

**🔗 Spec ref**: REQ-03
**�� Status**: work_prepend.md → 26/01/2026 19:45

---

### 2.2 ✅ UI Admin - Editor de Textos [MVP] ⏱️ 2h
**Descripción**: Página para editar textos de cada sección
**Archivos**:
- `src/app/[lang]/admin/content/page.tsx` ✅ (creado)
- `src/app/[lang]/admin/content/components/ContentEditorClient.tsx` ✅ (creado)
- `src/app/[lang]/admin/content/components/SectionEditor.tsx` ✅ (creado)
- `src/app/[lang]/admin/content/components/LocaleTabs.tsx` ✅ (creado)

**Subtareas**:
- [x] Selector de sección (Hero, Connect, Inspire, etc.)
- [x] Tabs de idioma (ES, EN, DE, FR, IT, RU)
- [x] Formulario dinámico según estructura de la sección
- [x] Campos: inputs para h1/h2, textareas para párrafos
- [ ] Preview del texto formateado (pendiente - mejora futura)
- [x] Botón guardar con feedback (loading, success, error)
- [x] Indicador de "sin traducción" si falta idioma
- [x] Copiar de otro idioma como base

**Características implementadas:**
- Dropdown de sección con stats de traducción por idioma
- LocaleTabs con indicador visual verde (traducido) / amarillo (falta)
- SectionEditor con formulario dinámico basado en sectionSchemas.ts
- Soporte para campos anidados (h1.span1, text.p1, etc.)
- Copiar contenido desde otro idioma
- Feedback visual: loading, success, error states
- Colores SPEC: #1c1f24, #2a2d35, #dc2626

**🔗 Spec ref**: REQ-03, REQ-05
**📊 Status**: work_prepend.md → 26/01/2026 21:00

---

### 2.3 ✅ Definir Estructura por Sección [P] ⏱️ 30min
**Descripción**: Mapeo de campos para cada sección
**Archivos**:
- `src/lib/cms/sectionSchemas.ts` ✅ (creado)

**Subtareas**:
- [x] Definir schema para "home" (h1, button)
- [x] Definir schema para "enjoy" (h1.span1, h1.span2, h1.span3)
- [x] Definir schema para "connect" (h1.span1, h1.span2)
- [x] Definir schema para "inspire" (h1, text.p1-p4, caption)
- [x] Definir schema para "contact" (h1.span1, h1.span2)
- [x] Definir schema para "getInTouch" (h1, contact)
- [x] Definir schema para "welcomePage" (h1, h2, h3, description, buttons)
- [x] Definir schema para "navbar" (nav array)
- [x] Definir schema para "dropdown" (title, languages)
- [x] Definir schema para "form" (labels, placeholders, buttons)
- [x] Exportar AVAILABLE_LOCALES (es, en, de, fr, it, ru)
- [x] Exportar AVAILABLE_SECTIONS y SECTION_SCHEMAS con metadata
- [x] Exportar tipos TypeScript inferidos
- [x] Helpers: validateSectionContent, getSectionFields, getNestedValue, setNestedValue

**🔗 Spec ref**: REQ-03
**📊 Status**: work_prepend.md → 26/01/2026 19:45

---

### 2.4 ✅ Integración Frontend - Textos [B] ⏱️ 1h
**Descripción**: Componentes usan textos de BD con fallback a JSON
**Archivos**:
- `src/queries/cms/getSectionContent.ts` ✅ (ya existía)
- `src/configs/dictionary.ts` ✅ (modificado - integración BD)

**Subtareas**:
- [x] Crear query con cache y fallback a JSON
- [x] Modificar getDictionary para consultar BD primero
- [x] Verificar que todas las secciones renderizan (fallback funciona)
- [x] Fix cache invalidation textos (revalidateTag con 3 tags) (28/01/2026)
- [ ] Probar cambio desde admin → aparece en frontend (pendiente verificación Rodolfo)

**Implementación:**
- `getDictionary(locale)` ahora consulta `SectionContent` en BD con cache 300s
- Si BD vacía o falla, cae silenciosamente a JSON estático
- Merge inteligente: BD tiene prioridad, JSON llena huecos
- Sin ruido en consola (solo log si DEBUG_CMS=true)
- Resiliente: si modelo no existe (pre-migración), usa JSON

**🔗 Spec ref**: REQ-07
**📊 Status**: work_prepend.md → 26/01/2026 23:00

---

### 2.5 ✅ Seed Datos Iniciales - Contenido [P] ⏱️ 30min
**Descripción**: Migrar contenido actual de JSON a BD
**Archivos**:
- `prisma/seeds/seed-content.ts` ✅ (creado)

**Subtareas**:
- [x] Script que lee dictionaries/*.json (es, en, de, fr, it, ru)
- [x] Inserta en SectionContent por cada sección+locale
- [x] Usa upsert para ser idempotente
- [x] ✅ Ejecutar seed (27/01/2026 - npm run db:seed)
- [x] Verificar datos en BD (27/01/2026 - 60 registros)

**Secciones migradas**: home, enjoy, connect, inspire, contact, getInTouch, welcomePage, navbar, dropdown, form

**🔗 Spec ref**: REQ-03
**📊 Status**: work_prepend.md → 26/01/2026 22:00

---

## ⚙️ FASE 3: CONFIG SITIO [MVP]

> **Objetivo**: Gestionar contacto, footer y redes
> **Estimación total**: 1 día
> **🔗 Spec ref**: REQ-04

### 3.1 ✅ Server Actions - Config CRUD [MVP] ⏱️ 30min
**Descripción**: Acciones para configuración del sitio
**Archivos**:
- `src/actions/cms/config.ts` ✅ (creado)

**Subtareas**:
- [x] `getConfigByGroup(group)` - Obtener configs por grupo
- [x] `getConfigByKey(key)` - Obtener config específica
- [x] `getAllConfigs()` - Listar todas las configs
- [x] `getAllConfigsGrouped()` - Configs agrupadas por grupo
- [x] `getConfigsByKeys(keys)` - Múltiples configs por keys
- [x] `upsertConfig(key, value, type, group, label?)` - Crear/Actualizar
- [x] `deleteConfig(id)` - Eliminar config
- [x] `upsertConfigBatch(group, configs[])` - Batch update de grupo
- [x] Helpers: `getContactInfo()`, `getSocialLinks()`
- [x] `seedDefaultConfigs(defaults)` - Para seeds iniciales
- [x] Validación con Zod (key, value, type, group)
- [ ] Seed inicial con valores actuales (movido a 3.4)

**Funciones extra implementadas:**
- Constantes: `CONFIG_GROUPS`, `CONFIG_TYPES`, `PREDEFINED_KEYS`
- Tipos: `ConfigGroup`, `ConfigType`, `ISiteConfig`, `ConfigMap`
- Revalidación de cache: `cms-config`, `site-config`

**🔗 Spec ref**: REQ-04
**📊 Status**: work_prepend.md → 26/01/2026 20:15

---

### 3.2 ✅ UI Admin - Configuración [MVP] ⏱️ 1h
**Descripción**: Página para editar configuración del sitio
**Archivos**:
- `src/app/[lang]/admin/settings/page.tsx` ✅ (creado)
- `src/app/[lang]/admin/settings/components/ConfigGroup.tsx` ✅ (creado)

**Subtareas**:
- [x] Secciones colapsables: Contacto, Redes Sociales, Footer
- [x] Contacto: teléfono, email, dirección, WhatsApp
- [x] Redes: Facebook, Instagram, YouTube, Twitter
- [x] Footer: copyright, año
- [x] Input tipo según config (text, url, email, phone)
- [x] Validación por tipo antes de guardar
- [x] Guardar por campo individual con feedback visual
- [x] Seed automático de configs predefinidas

**Características implementadas:**
- Grupos colapsables con iconos (Phone, Share2, FileText)
- Validación: email regex, URL parser, phone regex
- Estados visuales: idle, saving, saved, error
- Colores SPEC: #1c1f24, #2a2d35, #dc2626

**🔗 Spec ref**: REQ-04, REQ-05
**📊 Status**: work_prepend.md → 26/01/2026 21:30

---

### 3.3 ✅ Integración Frontend - Config [B] ⏱️ 45min
**Descripción**: Footer y contacto usan datos de BD
**Archivos**:
- `src/queries/cms/getSiteConfig.ts` ✅ (ya existia)
- `src/app/[lang]/components/sections/footer/Footer.tsx` ✅ (modificado)
- `src/app/[lang]/components/sections/getInTouch/GetInTouch.tsx` ✅ (modificado)
- `src/actions/cms/config.ts` ✅ (agregado PREDEFINED_CONFIGS)
- `src/app/[lang]/admin/settings/page.tsx` ✅ (agregado maps_link, website)

**Subtareas**:
- [x] Query configs con cache (getSocialLinks, getContactInfo, getConfigMapByGroup)
- [x] Footer usa redes sociales de BD (facebook, instagram, youtube, twitter)
- [x] Footer usa config footer de BD (copyright, website)
- [x] GetInTouch usa contacto de BD (phone, email, address, maps_link)
- [x] Fallback a valores hardcodeados si BD vacia
- [x] Agregado campo maps_link en admin settings
- [x] Agregado campo website en admin settings
- [x] PREDEFINED_CONFIGS con valores actuales para seed automatico

**Caracteristicas implementadas:**
- Footer ahora es async Server Component
- GetInTouch ahora usa getContactInfo() de queries
- Fallbacks robustos que mantienen el sitio funcional si BD vacia
- Hover effects en iconos (text-red-600 transition)
- Twitter solo aparece si existe en BD
- maps_link configurable desde admin

**🔗 Spec ref**: REQ-07
**📊 Status**: work_prepend.md → 26/01/2026 22:15

---

### 3.4 ✅ Seed Datos Iniciales - Config [P] ⏱️ 20min
**Descripción**: Insertar configuración inicial
**Archivos**:
- `prisma/seeds/seed-config.ts` ✅ (creado)

**Subtareas**:
- [x] Insertar contacto: phone, email, address, whatsapp
- [x] Insertar redes: facebook, instagram, youtube, twitter
- [x] Insertar footer: copyright, year, website
- [x] Usa upsert para ser idempotente
- [x] ✅ Ejecutar seed (27/01/2026 - npm run db:seed)

**Valores de redes extraidos del Footer.tsx**:
- facebook: https://www.facebook.com/theartgomagallery
- instagram: https://www.instagram.com/theartgomagallery
- youtube: https://www.youtube.com/@ArtGoMA

**🔗 Spec ref**: REQ-04
**📊 Status**: work_prepend.md → 26/01/2026 22:00

---

## ✨ FASE 4: POLISH & TEMPLATE [OPT]

> **Objetivo**: Pulir y preparar para reutilización
> **Estimación total**: 1 día
> **🔗 Spec ref**: REQ-08

### 4.1 ⬜ Template-Ready Refactor [OPT] ⏱️ 2h
**Descripción**: Asegurar que el CMS es reutilizable
**Archivos**:
- Varios (refactor)

**Subtareas**:
- [ ] Extraer configuración a variables de entorno
- [ ] Documentar cómo agregar nuevas secciones
- [ ] Verificar que no hay hardcoding específico de ArtGoMA
- [ ] Crear README del CMS

**🔗 Spec ref**: REQ-08
**📊 Status**: work_prepend.md

---

### 4.2 ⬜ Preview/Draft Mode [OPT] ⏱️ 2h
**Descripción**: Ver cambios antes de publicar
**Archivos**:
- TBD

**Subtareas**:
- [ ] Agregar campo `isDraft` a modelos
- [ ] Botón "Preview" en admin
- [ ] Query mode (draft vs published)
- [ ] Botón "Publicar" para hacer cambios visibles

**🔗 Spec ref**: spec.md → Consideraciones futuras
**📊 Status**: work_prepend.md

---

### 4.3 ⬜ Testing & QA [OPT] ⏱️ 1h
**Descripción**: Verificar todo funciona correctamente
**Archivos**:
- N/A

**Subtareas**:
- [ ] Probar CRUD completo de sliders
- [ ] Probar editor de textos en todos los idiomas
- [ ] Probar cambios de config
- [ ] Verificar que frontend refleja cambios
- [ ] Probar en móvil
- [ ] Karen hace prueba de usuario

**🔗 Spec ref**: Todos los REQ
**📊 Status**: work_prepend.md

---

## 📝 NOTAS IMPORTANTES

### Orden de Ejecución Recomendado:
1. ✅ **[B]** 1.1 Schema Prisma (todo depende de esto)
2. ✅ **[B]** 1.2 Auth temporal (proteger admin)
3. ✅ **[MVP]** 1.3 Layout admin (base visual)
4. ✅ **[MVP]** 1.4 + 1.5 Server actions + YouTube utils (paralelo)
5. ✅ **[MVP]** 1.6 + 1.7 UI Sliders (completado)
6. ✅ **[B]** 1.8 Integración frontend sliders (completado)
7. ✅ **[MVP]** Fase 2 completa (textos)
8. ✅ **[MVP]** Fase 3 completa (config)
9. ⬜ **[OPT]** Fase 4 si hay tiempo

---

## 🔴 VERIFICACIONES PENDIENTES DE RODOLFO (28/01/2026)

**Antes de marcar como 100% completado, Rodolfo debe verificar:**

### Sliders/Carousels:
- [ ] Toggle items activo/inactivo funciona en admin
- [ ] Upload imagen a Supabase funciona en AddItemDialog
- [ ] Upload imagen a Supabase funciona en EditItemDialog
- [ ] Nuevas imagenes de Supabase aparecen en frontend (<60s)
- [ ] Videos YouTube aparecen en carousel stories (items 13-14)
- [ ] Hero Carousel funciona con imagenes de BD
- [ ] Golden Tickets carousel funciona

### Textos Multiidioma:
- [ ] Editar texto en admin → se refleja en frontend
- [ ] Ver logs en consola: `[getDictionary] locale=es, DB sections=...`

### Config Sitio:
- [ ] Cambiar telefono/email → se refleja en GetInTouch
- [ ] Cambiar redes sociales → se refleja en Footer

### General:
- [ ] Reiniciar dev server despues de fixes de cache
- [ ] Hard refresh (Ctrl+Shift+R) para limpiar cache navegador

### Dependencias (TODAS COMPLETADAS):
```
1.1 ──► Todo lo demás ✅ DONE
1.2 ──► 1.3, 1.6, 1.7 ✅ DONE
1.4 ──► 1.6, 1.7, 1.8 ✅ DONE
1.5 ──► 1.7, 1.8 ✅ DONE
2.1 ──► 2.2, 2.4 ✅ DONE
3.1 ──► 3.2, 3.3 ✅ DONE
```

---

**📋 SPEC**: SPEC-26-01-2026-CMS-ContentManager
**🔗 Spec**: spec.md
**📊 Status**: work_prepend.md
