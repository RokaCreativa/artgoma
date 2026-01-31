# 🎯 MISSION-01: Migrar TODOS los Textos a BD

**Orquestador:** Claude Sonnet 4.5
**Agente:** Opus
**Prioridad:** CRÍTICA
**Estimación:** 2h

---

## 📋 EL PROBLEMA

Karen NO puede editar todos los textos del sitio desde el admin panel.

**Textos hardcoded encontrados:**
- Footer links: "Inicio", "Nosotros", "Eventos", etc
- Botones: "Confirmar", "Ver más", "Enviar"
- Labels de forms: "Nombre", "Email", "Teléfono"
- Mensajes de error/success
- Placeholders de inputs

**Dolor:** Cambiar un texto requiere tocar código → deploy.

---

## 💡 LA SOLUCIÓN

Agregar nueva sección "ui" a SectionContent con todos los textos de interfaz.

**Estructura propuesta:**
```json
{
  "sectionKey": "ui",
  "locale": "es",
  "content": {
    "buttons": {
      "confirm": "Confirmar",
      "submit": "Enviar",
      "cancel": "Cancelar",
      "seeMore": "Ver más"
    },
    "footer": {
      "home": "Inicio",
      "about": "Nosotros",
      "events": "Eventos",
      "contact": "Contacto"
    },
    "forms": {
      "name": "Nombre",
      "email": "Email",
      "phone": "Teléfono",
      "message": "Mensaje"
    }
  }
}
```

---

## 📁 ARCHIVOS A MODIFICAR

**1. Schema Zod nuevo:**
- `src/lib/cms/sectionSchemas.ts` - Agregar `UISchema`

**2. Componentes a actualizar:**
- `src/app/[lang]/components/sections/footer/Footer.tsx` - Links
- `src/app/[lang]/components/ButtonConfirm.tsx` - Texto botón
- `src/app/[lang]/components/ButtonSubmit.tsx` - Texto botón
- Buscar TODOS los componentes con textos hardcoded

**3. Seed:**
- `prisma/seeds/seed-content.ts` - Agregar sección "ui" en 6 idiomas

---

## ⚠️ REGLAS

1. **NO romper textos existentes** - Solo agregar los que faltan
2. **Usar getDictionary()** - NO crear nueva función
3. **Fallback a hardcoded** - Si BD vacía, mostrar texto original
4. **6 idiomas** - ES, EN, DE, FR, IT, RU

---

## 🧪 TESTING

- [ ] TypeScript compila
- [ ] Textos se ven igual (default values = hardcoded actuales)
- [ ] Admin panel `/admin/content` muestra nueva sección "UI"
- [ ] Cambiar un texto en admin → aparece en frontend

---

## 🎯 OUTPUT

Reportar en `worklog.md`:
- Cuántos textos migraste
- Qué componentes modificaste
- Schema de "ui" creado

**STANDBY después.**
