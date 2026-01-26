# Plan de Implementación - SPEC-24-01-2026-001-GranMigracion2026

## Guía de Matriz de Prioridades
- **[MVP]** = Debe hacerse primero - funcionalidad core que no se puede saltar
- **[B]** = Bloqueante - previene trabajo futuro, debe completarse antes de proceder
- **[P]** = Paralelo - se puede procesar en lote con otras tareas [P] para eficiencia
- **[OPT]** = Opcional - saltar si tiempo/contexto limitado, características deseables

## Estrategias de Contexto
- **Sesión corta (<1 hora)**: Solo tareas [MVP] + [B]
- **Sesión larga (>2 horas)**: [MVP] → [B] → lote [P] → [OPT] si hay tiempo
- **Emergencia (>85% contexto)**: Solo tareas [B] críticas, documentar todo en work_prepend.md

<!-- 
🎯 INSTRUCCIÓN: Cada tarea DEBE tener:
- Prioridad [MVP]/[B]/[P]/[OPT]
- Estimación de tiempo ⏱️
- Subtareas claras y accionables
- Cross-references triangulares (🔗📊🚨)
-->

---

## Fase 1: Core Upgrade (Next + React)

- [x] **[MVP]** 1. Actualización de paquete.json y dependencias ⏱️ 15min
  - [x] Ejecutar `npm install next@latest react@latest react-dom@latest`
  - [x] Actualizar `eslint-config-next` y types relacionados (`@types/react`, etc.)
  - [x] Resolver conflictos de peer dependencies inmediatos
  - 🔗 **Requirement**: Requirement #1
  - 📊 **Status**: work_prepend.md
  - 🚨 **Blocker**: Ninguno

- [x] **[B]** 2. Fix Breaking Changes React 19 / Next 16 ⏱️ 45min
  - [x] Revisar errores de compilación inicial (`npm run build`)
  - [x] Ajustar uso de `useFormState` -> `useActionState` (si aplica)
  - [x] Validar configuración en `next.config.js`
  - 🔗 **Requirement**: Requirement #1
  - 📊 **Status**: work_prepend.md
  - 🚨 **Blocker**: Tarea 1

## Fase 2: Modernización (Tailwind + Prisma)

- [x] **[MVP]** 3. Migración a Tailwind CSS v4 ⏱️ 30min
  - [x] Instalar `tailwindcss@next` (o v4 stable) y `@tailwindcss/postcss`
  - [x] Actualizar CSS imports
  - [x] Verificar que los estilos no se rompieron visualmente
  - 🔗 **Requirement**: Requirement #2
  - 📊 **Status**: work_prepend.md
  - 🚨 **Blocker**: Tarea 1

- [x] **[P]** 4. Actualización de Prisma ORM ⏱️ 20min
  - [x] `npm install prisma@latest @prisma/client@latest`
  - [x] `npx prisma generate`
  - [x] Verificar conexión a DB Supabase
  - 🔗 **Requirement**: Requirement #3
  - 📊 **Status**: work_prepend.md
  - 🚨 **Blocker**: Ninguno

## Fase 3: Validación y Limpieza

- [ ] **[MVP]** 5. Sanity Check de Funcionalidades Críticas ⏱️ 30min
  - [ ] Verificar Login (NextAuth)
  - [ ] Verificar Subida de Imágenes (Nueva API Supabase)
  - [ ] Verificar Navegación y Carousel
  - 🔗 **Requirement**: Requirement #4
  - 📊 **Status**: work_prepend.md
  - 🚨 **Blocker**: Fases 1 y 2

- [ ] **[P]** 6. Limpieza final de dependencias obsoletas ⏱️ 10min
  - [ ] Correr `npm audit fix` para vulnerabilidades restantes
  - [ ] Eliminar dependencias que ya no se usen (si hay)
  - 🔗 **Requirement**: Requirement #1
  - 📊 **Status**: work_prepend.md
  - 🚨 **Blocker**: Ninguno

---

## Guías de Checkpoint

### Después de Fase 1 (Fundación)
- [ ] Estructura base de archivos creada
- [ ] Funcionalidad core mínima funcionando
- [ ] Todas las tareas [MVP] y [B] de Fase 1 completadas
- [ ] work_prepend.md actualizado con progreso

### Después de Fase 2 (Implementación Core)
- [ ] Feature principal implementado
- [ ] Integración con sistema existente verificada
- [ ] No hay breaking changes
- [ ] Cross-references actualizadas en todos los archivos

### Después de Fase 3 (Calidad)
- [ ] Feedback de Rodolfo incorporado
- [ ] Validaciones y manejo de errores funcionando
- [ ] UX/UI pulido

### Después de Fase 4 (Testing)
- [ ] Testing end-to-end completado
- [ ] Documentación actualizada
- [ ] FILE STRUCTURE en spec.md refleja realidad

### Validación Final (Pre-Release)
- [ ] Rodolfo aprobó el feature
- [ ] Código limpio sin console.logs ni TODOs
- [ ] Flujo completo probado con ejemplos reales
- [ ] Contexto preservado para futuros agentes
- [ ] Listo para push a producción

---

## Métricas de Éxito

- **Tiempo de implementación**: [Sumar todos los ⏱️ realistas]
- **Calidad**: Legible en primera pasada, plan accionable
- **Supervivencia de contexto**: 100% recuperación después de compactación
- **Satisfacción del usuario**: Rodolfo aprueba en primera revisión
- **Mantenibilidad**: Actualizaciones fáciles cuando requirements cambien
- **Sincronización triangular**: 100% entre spec.md ↔ tasks.md ↔ work_prepend.md

---

**Tiempo Total Estimado**: [Sumar todas las ⏱]  
**Ruta Crítica**: Tareas 1 → 2 → 4 → 5 → 8 → 10 → 13  
**Nivel**: DEFAULT
**Cross-references**: spec.md ↔ tasks.md ↔ work_prepend.md (SINCRONIZACIÓN OBLIGATORIA)
