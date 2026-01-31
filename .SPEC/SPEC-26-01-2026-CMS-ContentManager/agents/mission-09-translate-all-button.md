# 🎯 MISSION-09: Botón "Traducir Todo" en ES

**Orquestador:** Claude Sonnet 4.5
**Agente:** Opus
**Prioridad:** ALTA
**Estimación:** 30min

---

## 📋 EL PROBLEMA

Cuando Karen edita contenido en **ES** (español), NO hay forma rápida de traducir a TODOS los otros idiomas.

**Flow actual (malo):**
1. Edita en ES
2. Va a EN → click ✨ → traducir
3. Va a DE → click ✨ → traducir
4. Repite 5 veces (una por idioma)

**Flow ideal:**
1. Edita en ES
2. Click "Traducir a todos los idiomas" → 1 botón
3. **Boom** - 5 idiomas traducidos en 10 segundos

---

## 💡 LA SOLUCIÓN

Agregar botón **"🌐 Traducir a todos los idiomas"** visible SOLO en tab ES.

**Ubicación:** LocaleTabs.tsx - junto al tab ES o arriba del formulario.

**Flow:**
1. Karen está en ES
2. Click botón "🌐 Traducir a todos"
3. Modal confirm: "¿Traducir esta sección a 5 idiomas? Costo: ~$0.010"
4. Si acepta → Loop llama API 5 veces (EN, DE, FR, IT, RU)
5. Loading con progreso: "Traduciendo EN... ✅ Traduciendo DE... 🔄"
6. Toast final: "✅ 5 idiomas traducidos correctamente"

---

## 📁 ARCHIVOS A MODIFICAR

**1. LocaleTabs.tsx:**
- Agregar botón visible solo si `selectedLocale === 'es'`
- Props adicional: `onTranslateAll`

**2. ContentEditorClient.tsx:**
- Handler `handleTranslateAll` que:
  - Confirm modal
  - Loop sobre ['en', 'de', 'fr', 'it', 'ru']
  - POST /api/translations/auto-translate para cada uno
  - Loading state con progreso
  - Toast final con resumen

---

## ⚠️ REGLAS

1. **Solo visible en ES** - Otros idiomas usan botón individual
2. **Loading con progreso** - "Traduciendo 2/5..."
3. **Continuar si falla uno** - Si EN falla, seguir con DE/FR/IT/RU
4. **Toast con resumen** - "✅ 4/5 traducidos. FR falló: [error]"

---

## 🎯 OUTPUT

Reportar:
- Dónde agregaste el botón
- Testing manual

**STANDBY.**
