# 🎯 MISSION-03: Sistema de Crop para Imágenes

**Orquestador:** Claude Sonnet 4.5
**Agente:** Opus
**Prioridad:** BAJA (feature avanzado)
**Estimación:** 3h

---

## 📋 EL PROBLEMA

Cuando Karen sube una imagen al slider, **NO puede ajustar el recorte** para que se vea perfecta.

**Ejemplo:**
- Foto artista 600x800px
- Carousel necesita 300x300px (cuadrado)
- Imagen se distorsiona o corta mal

**Rodolfo quiere:**
- Mover/escalar imagen dentro del crop area
- Preview en tiempo real
- Guardar crop metadata (x, y, zoom)

---

## 💡 LA SOLUCIÓN

Agregar crop editor en AddItemDialog/EditItemDialog con librería react-easy-crop.

**Flow:**
1. Usuario sube imagen
2. Aparece modal crop con preview
3. Usuario mueve/escala para ajustar
4. Click "Aplicar crop"
5. Guarda crop metadata en BD
6. Frontend aplica crop con CSS `object-position`

---

## 📁 ARCHIVOS A MODIFICAR

**1. Instalar librería:**
```bash
npm install react-easy-crop
```

**2. Schema Prisma:**
- Agregar campos opcionales: `cropX`, `cropY`, `cropZoom`

**3. Componentes crop:**
- Crear `src/app/[lang]/admin/sliders/components/ImageCropModal.tsx`
- Modificar AddItemDialog.tsx - Integrar crop modal
- Modificar EditItemDialog.tsx - Integrar crop modal

**4. Frontend:**
- Aplicar crop con `style={{ objectPosition: ... }}`

---

## ⚠️ REGLAS

1. **OPCIONAL** - No implementar si Rodolfo dice que es mucho
2. **Migration necesaria** - `prisma migrate dev` para campos crop
3. **Backward compatible** - Items sin crop usan `object-cover` normal

---

## 🎯 OUTPUT

Si decides implementar:
- Reportar librería instalada
- Migration ejecutada
- Componentes modificados

Si decides NO implementar:
- Reportar "MISSION-03 SKIPPED - feature avanzado para futuro"

**STANDBY.**
