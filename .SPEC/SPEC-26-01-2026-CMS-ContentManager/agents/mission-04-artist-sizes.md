# 🎯 MISSION-04: Tamaños Uniformes para Fotos Artistas

**Orquestador:** Claude Sonnet 4.5
**Agente:** Opus
**Prioridad:** MEDIA
**Estimación:** 1h

---

## 📋 EL PROBLEMA

Las fotos de artistas en el carousel tienen **tamaños diferentes** - se ve inconsistente.

**Rodolfo quiere:**
1. Tamaños predeterminados (ej: Small/Medium/Large)
2. Seleccionable desde admin panel al agregar/editar item
3. Uniformidad visual en el carousel

---

## 💡 LA SOLUCIÓN

Agregar campo `size` a SliderItem + UI en admin dialogs.

**Tamaños propuestos:**
- **Small:** 200x200px
- **Medium:** 300x300px (default)
- **Large:** 400x400px
- **Custom:** width/height manual

---

## 📁 ARCHIVOS A MODIFICAR

**1. Schema Prisma:**
- `prisma/schema.prisma` - Agregar campo `size` (enum o string)
- Ejecutar `prisma migrate dev --name add_item_size`

**2. Admin Dialogs:**
- `src/app/[lang]/admin/sliders/components/AddItemDialog.tsx` - Dropdown size
- `src/app/[lang]/admin/sliders/components/EditItemDialog.tsx` - Dropdown size

**3. Frontend:**
- `src/app/[lang]/components/carousel2/ArtistsCarouselClient.tsx` - Aplicar tamaño
- CSS classes para cada size

---

## ⚠️ REGLAS

1. **Migration necesaria** - `prisma migrate dev` requerido
2. **Backward compatible** - Items sin `size` usan default (Medium)
3. **Dropdown simple** - 4 opciones: Small/Medium/Large/Custom

---

## 🎯 OUTPUT

Reportar:
- Si hiciste migration
- Componentes modificados
- Testing manual necesario

**STANDBY.**
