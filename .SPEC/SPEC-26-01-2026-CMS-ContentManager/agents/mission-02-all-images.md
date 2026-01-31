# 🎯 MISSION-02: Migrar TODAS las Imágenes Decorativas a BD

**Orquestador:** Claude Sonnet 4.5
**Agente:** Opus
**Prioridad:** ALTA
**Estimación:** 1.5h

---

## 📋 EL PROBLEMA

Imágenes decorativas hardcoded que Karen NO puede cambiar:
- Favicon: `/favicon.ico`
- Apple touch icon: `/apple-touch-icon.png`
- OpenGraph image: `/bg-black-logo-goma.png`
- Circles decorativos (si hay)
- Cualquier otra imagen que NO sea de sliders

---

## 💡 LA SOLUCIÓN

Agregar configs appearance para TODAS las imágenes fijas.

**Ya configurables:**
- ✅ Logo navbar
- ✅ Imagen Connect (banana)
- ✅ Pattern Connect
- ✅ Favicon (parcial)

**Faltan:**
- ❌ Apple touch icon
- ❌ OpenGraph image
- ❌ Cualquier otra decorativa

---

## 📁 ARCHIVOS A MODIFICAR

**1. Buscar imágenes hardcoded:**
```bash
grep -r "src=\"/" src/app/[lang]/components/ --include="*.tsx"
grep -r "url.*png\|url.*jpg\|url.*avif" src/ --include="*.tsx"
```

**2. Agregar configs:**
- `src/app/[lang]/admin/settings/page.tsx` - Nuevos campos

**3. Usar configs:**
- `src/app/[lang]/layout.tsx` - OpenGraph image desde BD
- Componentes que usen las imágenes

**4. Seed:**
- `src/app/api/seed-appearance/route.ts` - Agregar defaults

---

## ⚠️ REGLAS

1. **Solo imágenes decorativas** - NO tocar sliders/carousels
2. **Fallback a default** - Si BD vacía, usar imagen original
3. **Paths absolutos** - URLs completas o paths desde `/public`

---

## 🎯 OUTPUT

Reportar:
- Cuántas imágenes encontraste
- Cuáles agregaste a configs
- Componentes modificados

**STANDBY.**
