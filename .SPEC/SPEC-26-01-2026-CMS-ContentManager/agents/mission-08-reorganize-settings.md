# 🎯 MISSION-08: Reorganizar Settings + Upload Imágenes

**Orquestador:** Claude Sonnet 4.5
**Agente:** Opus
**Prioridad:** CRÍTICA
**Estimación:** 2h

---

## 📋 EL PROBLEMA

**Panel Configuración está MEZCLADO:**
- Apariencia tiene: Colores + Fonts + Imágenes + Meta tags
- Es confuso - demasiadas cosas juntas
- Las imágenes solo aceptan URL (NO se pueden subir)

**Rodolfo quiere:**
1. Separar en pestañas lógicas
2. Upload de imágenes (como en sliders)
3. Mejor organización

---

## 💡 LA SOLUCIÓN

**REORGANIZAR en 4 grupos:**

### 1. **Apariencia** (Colores + Fonts)
- 5 color pickers (bg_primary, bg_surface, bg_input, accent_color, bg_footer)
- 2 dropdowns fonts (font_display, font_body)

### 2. **Imágenes** (NUEVO grupo)
- Logo navbar (con upload)
- Favicon (con upload)
- Imagen Connect banana (con upload)
- Pattern Connect (con upload)
- Explore icon (con upload)
- Rotate axis icon (con upload)
- Logo horizontal (con upload)
- Logo vertical (con upload)

### 3. **Meta Tags** (SEO)
- Título del sitio
- Descripción del sitio
- OpenGraph image (con upload)
- Apple touch icon (con upload)

### 4. **Contacto** (ya existe - mantener)
### 5. **Redes Sociales** (ya existe - mantener)
### 6. **Footer** (ya existe - mantener)

---

## 📁 ARCHIVOS A MODIFICAR

**1. Reorganizar grupos:**
- `F:\PROYECTOS\ARTGOMA\src\app\[lang]\admin\settings\page.tsx`

**2. Agregar upload a ConfigGroup:**
- `F:\PROYECTOS\ARTGOMA\src\app\[lang]\admin\settings\components\ConfigGroup.tsx`
- Agregar botón "Subir imagen" cuando type="url" Y key contiene "image|logo|icon|favicon"
- Reutilizar lógica de AddItemDialog.tsx (upload a Supabase)

**3. Actualizar configConstants:**
- `F:\PROYECTOS\ARTGOMA\src\lib\cms\configConstants.ts`
- Crear grupos: "appearance", "images", "meta"

---

## ⚠️ REGLAS

1. **NO romper configs existentes** - Solo reorganizar
2. **Upload = opcional** - Puede pegar URL o subir imagen
3. **Mismo patrón que sliders** - Input URL + divider "o subir nueva" + upload
4. **Validación** - PNG/JPG/WebP/SVG, max 2MB para icons
5. **Bucket Supabase** - Usar "events" como en sliders

---

## 🎯 OUTPUT

Reportar en worklog.md:
- Nuevos grupos creados
- Upload implementado en cuántos campos
- Patrón UI usado

**STANDBY.**
