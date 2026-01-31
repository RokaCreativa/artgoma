# 🤖 BRIEFING AGENTES OPUS - CMS ARTGOMA COMPLETION

**Fecha:** 28/01/2026 04:45
**Orquestador:** Claude Sonnet 4.5
**Misión General:** Hacer TODO configurable desde admin panel

---

## 🚨 CONTEXTO CRÍTICO

**LO QUE FUNCIONA (NO ROMPER):**
- ✅ Sistema CMS base (sliders, textos multiidioma, config)
- ✅ BD: 6 sliders, 48 items, 60 contenidos
- ✅ Admin panel: /admin/sliders, /admin/content, /admin/settings
- ✅ Fase 5 Appearance: Colores, fonts, imágenes Connect
- ✅ Cache invalidation con revalidateTag("tag", "max")
- ✅ Upload imágenes a Supabase Storage

**LO QUE FALTA:**
- ❌ **Textos hardcoded** - Hay textos que NO están en SectionContent
- ❌ **Imágenes hardcoded** - Hay imágenes decorativas fijas
- ❌ **Fotos artistas tamaños** - No uniformes
- ❌ **Crop de imágenes** - No se puede ajustar en admin
- ❌ **Teléfono** - No editable en Contacto (bug)

---

## 📁 ARCHIVOS CLAVE

### Base de Datos:
- `prisma/schema.prisma` - Modelos: Slider, SliderItem, SectionContent, SiteConfig
- `F:\PROYECTOS\ARTGOMA\src\lib\db.ts` - Cliente Prisma

### Admin Panel:
- `src/app/[lang]/admin/settings/page.tsx` - Página configuración
- `src/app/[lang]/admin/settings/components/ConfigGroup.tsx` - Grupo configs
- `src/app/[lang]/admin/content/page.tsx` - Editor textos multiidioma
- `src/app/[lang]/admin/sliders/` - Gestión sliders

### Frontend:
- `src/app/[lang]/components/sections/` - Todas las secciones
- `src/configs/dictionary.ts` - getDictionary() para textos
- `src/actions/cms/config.ts` - getConfigByKey() para configs

---

## ⚠️ REGLAS SUPREMAS

1. **NO romper el sistema actual** - Solo agregar, no refactorizar
2. **Cache invalidation** - SIEMPRE usar `revalidateTag("tag", "max")` con 2 argumentos
3. **Tailwind v4 syntax** - Usar `bg-[var(--variable)]` NO `bg-variable`
4. **Admin panel colores** - Hardcoded (`bg-[#1c1f24]`), NO variables
5. **TypeScript** - Build debe pasar sin errores
6. **Fallbacks** - Siempre valores default si BD vacía

---

## 🎯 OUTPUT OBLIGATORIO

**AL TERMINAR CADA MISIÓN:**

1. Reportar en `worklog.md` (LIFO - entrada nueva ARRIBA)
2. Formato:
```markdown
### [TIMESTAMP] - AGENTE MISSION-XX: [Título]

**Archivos modificados:**
- [ruta completa]

**Hallazgos:**
- [qué encontraste]

**Fix aplicado:**
- [qué cambiaste]

**Testing:**
- [qué probaste]

**Status:** ✅ COMPLETADO / ⏳ BLOQUEADO / ❌ FALLIDO
**STANDBY** para órdenes de Rodolfo
```

3. **QUEDARSE EN STANDBY** - NO hacer commits
4. **NO crear nuevos archivos de docs** - solo modificar código

---

## 🧪 TESTING OBLIGATORIO

**Antes de reportar como COMPLETADO:**
- ✅ TypeScript compila (`npx tsc --noEmit`)
- ✅ Archivos modificados están documentados
- ✅ Fallbacks probados (si BD vacía, usa default)
- ✅ Código sigue patrones existentes

---

**LEE TU BRIEFING ESPECÍFICO (mission-XX.md) AHORA.**
