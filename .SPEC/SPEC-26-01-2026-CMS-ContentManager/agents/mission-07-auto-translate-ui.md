# 🎯 MISSION-07: UI Auto-Traducción en Admin Panel

**Orquestador:** Claude Sonnet 4.5
**Agente:** Opus
**Prioridad:** CRÍTICA
**Estimación:** 1h
**Depende de:** MISSION-06 (API debe existir)

---

## 📋 EL PROBLEMA

Karen tiene la API de auto-traducción pero **NO hay botón en el admin** para usarla.

**Necesita:**
- Botón "Auto-traducir desde ES" en cada tab de idioma
- Feedback visual (loading, success, error)
- Ver cuántos campos se tradujeron
- Costo estimado mostrado

---

## 💡 LA SOLUCIÓN (inspirada en IAMenu)

Agregar botón "✨ Auto-traducir desde Español" en `LocaleTabs.tsx`.

**Flow:**
1. Karen selecciona idioma (ej: EN)
2. Click botón "Auto-traducir desde ES"
3. Modal confirm: "¿Traducir 5 campos vacíos? Costo: $0.002"
4. Si acepta → POST `/api/translations/auto-translate`
5. Loading spinner mientras traduce
6. Toast success: "✅ 5 campos traducidos correctamente"
7. Formulario se actualiza con los valores nuevos

---

## 📁 ARCHIVOS A MODIFICAR

**1. LocaleTabs component:**
- `F:\PROYECTOS\ARTGOMA\src\app\[lang]\admin\content\components\LocaleTabs.tsx`

**Cambios:**
```tsx
// Agregar botón junto a cada tab
{locale !== 'es' && (
  <button
    onClick={() => handleAutoTranslate(sectionKey, locale)}
    className="..."
  >
    ✨ Auto-traducir desde ES
  </button>
)}
```

**2. ContentEditorClient (orquestador):**
- `F:\PROYECTOS\ARTGOMA\src\app\[lang]\admin\content\components\ContentEditorClient.tsx`

**Función nueva:**
```typescript
const handleAutoTranslate = async (
  sectionKey: string,
  targetLocale: string
) => {
  // 1. Confirm modal
  // 2. POST /api/translations/auto-translate
  // 3. Refresh data
  // 4. Toast feedback
}
```

**3. Opcional - Coverage indicator:**
Mostrar "3/5 campos ⚠️" en cada tab para que Karen sepa qué falta.

---

## 📚 REFERENCIA IAMENU

**Archivo a estudiar:**
- `F:\PROYECTOS\ROKAMENU\src\components\admin\I18nSyncTab.tsx` (si existe)

**Aprender:**
- Cómo muestra el coverage map
- Cómo maneja el loading state
- Cómo muestra errores de traducción

---

## ⚠️ REGLAS ESPECÍFICAS

1. **NO tocar SectionEditor** - Solo agregar botón en LocaleTabs
2. **Confirm antes de traducir** - Evitar clicks accidentales
3. **Loading state** - Disable botón mientras traduce (puede tardar 5-10s)
4. **Toast con info útil** - "✅ 5 campos traducidos, costó $0.003"
5. **Error handling** - Mostrar error de API en Toast
6. **Refresh data** - router.refresh() después de traducir

---

## 🧪 TESTING

**Caso 1: Traducir sección vacía**
- Idioma: EN (vacío)
- Click "Auto-traducir desde ES"
- Esperado: Modal confirm → Traduce → Success toast → Formulario lleno

**Caso 2: Traducir sección parcial**
- Idioma: DE (solo h1 existe)
- Click "Auto-traducir"
- Esperado: Solo traduce campos vacíos, preserva h1

**Caso 3: Error de API**
- Simular fallo (desconectar internet)
- Esperado: Toast error "Error al traducir, intenta de nuevo"

---

## 🎯 OUTPUT

Reportar en worklog.md:
- Componentes modificados (rutas completas)
- Dónde agregaste el botón
- Testing manual realizado
- Screenshots del UI (opcional)

**CHECKLIST:**
- [ ] TypeScript compila
- [ ] Botón solo visible en idiomas NO-ES
- [ ] Loading state implementado
- [ ] Error handling robusto
- [ ] Toast feedback claro

**STANDBY.**
