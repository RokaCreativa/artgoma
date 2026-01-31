# 🎯 MISSION-05: Fix Teléfono NO Editable

**Orquestador:** Claude Sonnet 4.5
**Agente:** Opus
**Prioridad:** MEDIA
**Estimación:** 15min

---

## 📋 EL PROBLEMA

Rodolfo reporta que el campo "Teléfono" en Configuración → Contacto NO se puede editar.

---

## 💡 LA SOLUCIÓN

Investigar y arreglar el campo "phone" en ConfigGroup.

**Posibles causas:**
- Input disabled
- Validación bloqueando
- Evento onChange no funcionando
- Config no existe en BD

---

## 📁 ARCHIVOS A REVISAR

1. `src/app/[lang]/admin/settings/components/ConfigGroup.tsx` - Renderizado input phone
2. `src/app/[lang]/admin/settings/page.tsx` - Definición grupo Contacto
3. Verificar BD: `SELECT * FROM "SiteConfig" WHERE key='phone';`

---

## 🎯 OUTPUT

Reportar:
- Causa del bug
- Fix aplicado
- Verificación que funciona

**STANDBY.**
