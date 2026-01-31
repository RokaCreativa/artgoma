# 🤖 METODOLOGÍA AGENTES OPUS - BRIEFINGS + WORKLOGS

**Versión:** 1.0
**Fecha:** 28/01/2026
**Autor:** Claude Sonnet 4.5 + Rodolfo
**Estado:** EN PRUEBA (aprobar antes de agregar a CLAUDE.md)

---

## 📋 CUÁNDO USAR ESTA METODOLOGÍA

### ✅ USAR cuando:

**Proyectos complejos con múltiples agentes** (3+ agentes en paralelo):
- Bugs difíciles que requieren investigación profunda en múltiples archivos
- Implementaciones grandes (FASE 5, FASE 18, migraciones complejas)
- Cuando el SPEC principal es >1000 líneas
- Múltiples frentes de trabajo independientes (textos + imágenes + configs)

**Beneficios observados (28/01/2026 - Fase 5):**
- ⚡ **Velocidad x3:** 3h trabajo secuencial → 1.5h wall-clock
- 🎯 **Contexto focalizado:** Briefings de 200 líneas vs SPEC de 3000
- 📊 **Trazabilidad:** Worklog LIFO = historia completa de qué agente hizo qué
- 🏗️ **Rol arquitecto:** Orquestador diseña, agentes ejecutan

### ❌ NO USAR cuando:

- 1 agente simple (overkill - briefing innecesario)
- Fixes rápidos (<1 hora de trabajo)
- Investigación ligera o búsquedas
- SPEC pequeño (<500 líneas) que cabe fácil en contexto

**Regla de oro:** Si puedes explicar la tarea en <100 palabras, NO necesitas briefing.

---

## 📁 ESTRUCTURA DE CARPETAS

Crear carpeta `agents/` dentro del SPEC:

```
.SPEC/SPEC-XXX-nombre/
├── spec.md              # Requirement completos
├── tasks.md             # Plan de tareas
├── work_prepend.md      # Log LIFO de trabajo
├── rules.md             # Reglas del SPEC
└── agents/              # ← NUEVA CARPETA
    ├── briefing.md          # Contexto general para TODOS los agentes
    ├── worklog.md           # LIFO donde agentes reportan (reemplaza work_prepend durante trabajo)
    ├── mission-01-xxx.md    # Briefing específico misión 1
    ├── mission-02-xxx.md    # Briefing específico misión 2
    └── mission-XX-xxx.md    # Un briefing por agente/misión
```

**Filosofía:**
- `agents/` = Scratch space temporal para trabajo paralelo
- Al terminar sesión → Fusionar reportes importantes al `work_prepend.md` principal
- Opcional: Borrar `agents/` después (ya fusionado al SPEC)

---

## 📝 FORMATO BRIEFING.MD (General)

**Archivo:** `agents/briefing.md` - Leído por TODOS los agentes

```markdown
# 🤖 BRIEFING AGENTES OPUS - [Nombre Proyecto]

**Fecha:** [DD/MM/YYYY HH:MM]
**Orquestador:** Claude Sonnet 4.5
**Misión General:** [Descripción 1 línea]

---

## 🚨 CONTEXTO CRÍTICO

**LO QUE FUNCIONA (NO ROMPER):**
- ✅ [Sistema X que está working]
- ✅ [Feature Y que NO tocar]
- ✅ [Cache/BD/Auth que funcionan]

**LO QUE FALTA:**
- ❌ [Problema A a resolver]
- ❌ [Problema B a resolver]

---

## 📁 ARCHIVOS CLAVE

### Base de Datos:
- [Schema, modelos, queries importantes]

### Admin Panel:
- [Páginas admin relevantes]

### Frontend:
- [Componentes principales]

---

## ⚠️ REGLAS SUPREMAS

1. **NO romper el sistema actual** - Solo agregar, no refactorizar sin permiso
2. **Cache invalidation** - [Reglas específicas del proyecto]
3. **Sintaxis específica** - [ej: Tailwind v4, TypeScript strict, etc]
4. **Colores/Styles** - [Qué NO tocar]
5. **TypeScript** - Build debe pasar SIEMPRE
6. **Fallbacks** - Siempre valores default si BD vacía

---

## 🎯 OUTPUT OBLIGATORIO

**AL TERMINAR CADA MISIÓN:**

1. Reportar en `worklog.md` (LIFO - entrada nueva ARRIBA)
2. Usar template obligatorio (ver abajo)
3. **QUEDARSE EN STANDBY** - NO hacer commits
4. **NO crear nuevos archivos de docs** - solo modificar código

---

## 🧪 TESTING OBLIGATORIO

**Antes de reportar como COMPLETADO:**
- ✅ TypeScript compila (`npx tsc --noEmit`)
- ✅ Archivos modificados están documentados con rutas completas
- ✅ Fallbacks probados (si BD vacía, usa default)
- ✅ Código sigue patrones existentes del proyecto

---

**LEE TU BRIEFING ESPECÍFICO (mission-XX.md) AHORA.**
```

---

## 📝 FORMATO MISSION-XX.MD (Específico)

**Archivo:** `agents/mission-01-xxx.md` - Un briefing por misión

**Límite:** 150-300 líneas MAX (focalizado)

```markdown
# 🎯 MISSION-XX: [Título Corto]

**Orquestador:** Claude Sonnet 4.5
**Agente:** Opus
**Prioridad:** CRÍTICA / ALTA / MEDIA / BAJA
**Estimación:** Xh

---

## 📋 EL PROBLEMA

[Descripción específica - QUÉ está roto, QUÉ falta, QUÉ hay que hacer]

**Dolor del usuario:**
[Por qué importa resolver esto]

**Contexto adicional:**
[Info que el agente necesita saber]

---

## 💡 LA SOLUCIÓN

[Approach propuesto - CÓMO lo vas a resolver]

**Estructura/Arquitectura:**
[Si aplica - schema de datos, estructura de componentes]

**Ejemplo de código esperado:**
```typescript
// Si es útil mostrar el patrón esperado
```

---

## 📁 ARCHIVOS A MODIFICAR (RUTAS COMPLETAS)

**OBLIGATORIO - Listar archivos específicos:**

1. **[Categoría]:**
   - `F:\PROYECTOS\...\archivo.tsx` - [Qué modificar aquí]
   - `F:\PROYECTOS\...\otro.ts` - [Qué modificar aquí]

2. **[Otra categoría]:**
   - `F:\PROYECTOS\...` - [Qué hacer]

**Comandos útiles para encontrar archivos:**
```bash
grep -r "pattern" src/ --include="*.tsx"
find src/ -name "*.tsx" -path "*/admin/*"
```

---

## ⚠️ REGLAS ESPECÍFICAS DE ESTA MISIÓN

1. [Regla específica para esta tarea]
2. [Qué NO tocar]
3. [Patrón a seguir]
4. [Edge cases a considerar]

---

## 🧪 TESTING

**Checklist específico:**
- [ ] [Caso de prueba 1]
- [ ] [Caso de prueba 2]
- [ ] [Verificación específica]

---

## 🎯 OUTPUT ESPERADO

**Reportar en worklog.md usando TEMPLATE OBLIGATORIO (ver abajo).**

**Información específica a incluir:**
- [Métrica 1: ej. "Cuántos textos migraste"]
- [Métrica 2: ej. "Qué componentes modificaste"]

**STANDBY después.**
```

---

## 📊 FORMATO WORKLOG.MD

**Archivo:** `agents/worklog.md` - Los agentes reportan aquí (LIFO)

### Header del archivo:

```markdown
# 🤖 WORKLOG AGENTES (LIFO - Newest First)

**Fecha:** [DD/MM/YYYY HH:MM]
**Orquestador:** Claude Sonnet 4.5

---

## 📊 QUICK STATUS

\```yaml
total_missions: X
status: ✅ DONE / 🔄 IN PROGRESS / ❌ FAILED
completed: X/Y
in_progress: X/Y
failed: X/Y
\```

**Missions:**
- [✅] MISSION-01: [Título] - COMPLETADO
- [🔄] MISSION-02: [Título] - IN PROGRESS
- [⏳] MISSION-03: [Título] - STANDBY
- [❌] MISSION-04: [Título] - BLOCKED

---

## 📜 AGENT LOG (NEWEST FIRST)
```

### Template de reporte (OBLIGATORIO para agentes):

```markdown
### [DD/MM/YYYY HH:MM] - AGENTE MISSION-XX: [Título Descriptivo]

**ARCHIVOS MODIFICADOS (rutas completas OBLIGATORIAS):**
- `F:\PROYECTOS\ARTGOMA\src\...\archivo.tsx` (líneas 45-67: agregado validación)
- `F:\PROYECTOS\ARTGOMA\src\...\otro.ts` (líneas 120-145: migrado colores)
- `F:\PROYECTOS\ARTGOMA\prisma\seeds\seed.ts` (líneas 30-35: agregado defaults)

**ARCHIVOS LEÍDOS (contexto):**
- `F:\PROYECTOS\ARTGOMA\...` (para entender cómo funciona X)

**ARCHIVOS QUE DEBERÍAS VERIFICAR:**
- `F:\PROYECTOS\ARTGOMA\...` (puede verse afectado por mis cambios)

**Hallazgos:**
- [Qué encontré que estaba roto]
- [Qué patrones descubrí]
- [Qué asunciones validé o descarté]

**Fix aplicado:**
- [Qué cambié exactamente]
- [Por qué tomé esta decisión]
- [Alternativas que consideré]

**Testing realizado:**
- [✅] TypeScript compila sin errores
- [✅] Fallback a default probado (si BD vacía)
- [✅] Patrón X verificado en archivo Y
- [⏳] REQUIERE testing manual de Rodolfo: [qué debe probar]

**Métricas:**
- X archivos modificados
- Y textos/imágenes/configs migrados
- Z líneas de código agregadas/modificadas

**Problemas encontrados (si los hay):**
- [Bloqueador A - necesita decisión de Rodolfo]
- [Warning B - no crítico pero debe saber]

**Status:** ✅ COMPLETADO / ⏳ BLOQUEADO / ❌ FALLIDO

**STANDBY** para más órdenes de Rodolfo.

---
```

---

## 🔄 NUEVA REGLA: PROGRESS UPDATES MID-TASK

**Los agentes deben actualizar worklog.md DOS VECES:**

**1. Al 50% de progreso:**
```markdown
### [TIMESTAMP] - AGENTE MISSION-XX: ⏳ PROGRESO 50%

**Estado actual:**
- Encontré X archivos con [problema]
- Modificando Y de Z archivos
- ETA: ~30 min más

**Próximo paso:**
- [Qué haré ahora]
```

**2. Al 100% (reporte completo con template obligatorio)**

**Beneficio:** El orquestador sabe si están avanzando o trabados.

---

## 🚫 NUEVA REGLA: EVITAR DUPLICACIÓN

**ANTES de modificar cualquier archivo:**

1. **Leer `worklog.md` completo** (OBLIGATORIO)
2. Verificar si otro agente ya tocó ese archivo
3. Si hay overlap:
   - **REPORTAR:** "Detecté que MISSION-02 ya modificó archivo X. ¿Procedo o coordino?"
   - **ESPERAR** decisión del orquestador
   - **NO duplicar** trabajo ciegamente

**Si 2 agentes necesitan el mismo archivo:**
- El orquestador decide quién va primero
- El segundo agente lee cambios del primero antes de modificar

---

## 🔧 FORMATO RUTAS (OBLIGATORIO)

**SIEMPRE rutas completas, NUNCA relativas:**

✅ **CORRECTO:**
```
- F:\PROYECTOS\ARTGOMA\src\app\[lang]\layout.tsx (líneas 45-67)
- F:\PROYECTOS\ARTGOMA\src\lib\cms\utils.ts (líneas 120-145)
```

❌ **INCORRECTO:**
```
- layout.tsx (modificado)
- Varios archivos en src/lib/
- Componentes de carousel
```

**Formato específico:**
```
- [RUTA_COMPLETA] (líneas X-Y: [qué se modificó])
```

**Por qué:** Permite al orquestador/Rodolfo ir directo al archivo sin buscar.

---

## 📐 CHECKLIST OBLIGATORIO ANTES DE REPORTAR

**Cada agente DEBE verificar esto antes de decir "COMPLETADO":**

```markdown
**CHECKLIST OBLIGATORIO:**
- [ ] TypeScript compila (`npx tsc --noEmit` ejecutado y PASÓ)
- [ ] Fallbacks a default implementados (código NO rompe si BD vacía)
- [ ] Seed actualizado (si agregaste configs/contenido nuevo)
- [ ] Backward compatible (código viejo sigue funcionando)
- [ ] Patrones del proyecto seguidos (no inventé arquitectura nueva)
- [ ] Rutas completas listadas en reporte
- [ ] worklog.md actualizado (LIFO - mi entrada arriba)
```

**Si NO pasó TypeScript:**
- ❌ **NO reportar como completado**
- 🔧 **Arreglar primero**
- 📝 **Si es bloqueador, reportar como BLOQUEADO con detalles**

---

## 🎯 TEMPLATE OUTPUT OBLIGATORIO

**COPIAR/PEGAR este template en worklog.md:**

```markdown
### [31/01/2026 05:45] - AGENTE MISSION-XX: [Título Descriptivo del Work]

**ARCHIVOS MODIFICADOS (rutas completas OBLIGATORIAS):**
- `F:\PROYECTOS\ARTGOMA\src\...\archivo.tsx` (líneas 45-67: agregado validación)
- `F:\PROYECTOS\ARTGOMA\src\...\otro.ts` (líneas 120-145: migrado colores)

**ARCHIVOS LEÍDOS (contexto):**
- `F:\PROYECTOS\ARTGOMA\...` (para entender cómo funciona X)

**ARCHIVOS QUE DEBERÍAS VERIFICAR:**
- `F:\PROYECTOS\ARTGOMA\...` (puede verse afectado por mis cambios)

**Hallazgos:**
- [Qué encontré]
- [Qué patrones descubrí]

**Fix aplicado:**
- [Qué cambié]
- [Por qué esta solución]

**Testing realizado:**
- [✅] TypeScript compila
- [✅] Fallback probado
- [⏳] Requiere testing manual: [qué]

**Métricas:**
- X archivos modificados
- Y elementos migrados

**Problemas (si los hay):**
- [Bloqueador o warning]

**CHECKLIST OBLIGATORIO:**
- [✅] TypeScript compila
- [✅] Fallbacks implementados
- [✅] Seed actualizado
- [✅] Backward compatible
- [✅] Rutas completas listadas

**Status:** ✅ COMPLETADO / ⏳ BLOQUEADO / ❌ FALLIDO

**STANDBY** para más órdenes de Rodolfo.

---
```

**NO desviarse del template.** Consistencia = fácil de leer después.

---

## 🔄 FUSIÓN AL SPEC FINAL

**Al final de la sesión (cuando todos los agentes terminaron):**

### Paso 1: Consolidar worklogs
Leer todos los reportes en `agents/worklog.md` y extraer:
- Archivos modificados importantes
- Hallazgos relevantes para el futuro
- Problemas encontrados

### Paso 2: Crear entrada única en work_prepend.md
```markdown
### [FECHA] - SESIÓN MULTI-AGENTE: [Título]

**Misiones ejecutadas:** 5 agentes Opus en paralelo
1. MISSION-01: [Título] - [Resultado breve]
2. MISSION-02: [Título] - [Resultado breve]
...

**Archivos críticos modificados:**
- [Lista consolidada de los más importantes]

**Hallazgos clave:**
- [Insight 1]
- [Insight 2]

**Impacto:**
- [Qué cambió para el usuario final]

**🔗 Spec ref:** tasks.md Fase X
**📊 Progreso:** [Antes] → [Después]
```

### Paso 3: Opcional - Borrar agents/
- `agents/` es temporal (scratch space)
- Si todo está fusionado al SPEC, se puede borrar
- O dejar para auditoría futura

**Regla de oro:**
> "Los futuros Claudes leen SPEC (work_prepend.md), NO agents/. El SPEC es la fuente de verdad."

---

## 🎯 VENTAJAS OBSERVADAS (28/01/2026)

**Sesión real:** Fase 5 - Appearance Config

| Aspecto | Sin agentes | Con agentes (paralelo) |
|---------|-------------|------------------------|
| Tiempo wall-clock | 5h secuencial | 1.5h paralelo |
| Contexto por agente | 3000 líneas SPEC | 200 líneas briefing |
| Trazabilidad | Difusa | Clara (worklog LIFO) |
| Rol Claude | Implementador | Arquitecto/Orquestador |
| Calidad | Variable (cansancio) | Alta (agentes frescos) |

**Quote de Claude:**
> "Me sentí más como 'senior que lidera equipo' que 'junior que hace todo'. Y eso, joder, estuvo bien."

---

## ⚠️ DESVENTAJAS / CUIDADOS

**1. Menos control mid-task**
- No puedes intervenir mientras el agente trabaja
- Si se traba, no lo ves hasta el reporte
- **Mitigación:** Progress updates al 50%

**2. Posible duplicación de trabajo**
- Agentes pueden tocar los mismos archivos
- **Mitigación:** Regla de leer worklog.md ANTES de modificar

**3. Overhead de setup**
- Crear briefings toma 10-15 min
- Solo vale la pena para proyectos grandes
- **Regla:** <1h de trabajo = NO usar agentes

---

## 📚 EJEMPLO REAL DE USO

**Proyecto:** SPEC-26-01-2026-CMS-ContentManager
**Fecha:** 28/01/2026
**Fase:** 5 - Appearance Config

**Setup (15 min):**
1. Investigué yo mismo (globals.css, colores, fonts)
2. Creé Fase 5 en SPEC (tasks.md, spec.md, work_prepend.md)
3. Creé agents/ folder
4. Escribí briefing.md general
5. Escribí 5 mission briefings (mission-01 a mission-05)
6. Creé worklog.md vacío

**Ejecución (1.5h):**
1. Lancé 3 agentes Opus en paralelo:
   - MISSION-01: Migrar textos → BD (17 archivos, 132 traducciones)
   - MISSION-02: Migrar imágenes → BD (7 archivos, 6 imágenes)
   - MISSION-05: Fix teléfono (1 archivo, debugging logs)

2. Agentes reportaron en worklog.md (LIFO)
3. Revisé reportes, verifiqué TypeScript
4. Ejecuté seeds en BD

**Resultado:**
- ✅ 25 archivos modificados
- ✅ 132 traducciones + 19 configs + 6 imágenes migradas
- ✅ TypeScript sin errores
- ✅ SPEC actualizado con todo

**Tiempo ahorrado:** ~3.5h (5h secuencial vs 1.5h paralelo)

---

## 🚀 IMPLEMENTACIÓN EN CLAUDE.MD

**Cuando estemos seguros que funciona bien:**

Agregar esta sección a `C:\Users\34605\.claude\CLAUDE.md`:

```markdown
## 🤖 METODOLOGÍA AGENTES OPUS - BRIEFINGS + WORKLOGS

[Copiar contenido relevante de este archivo]

**Regla de activación:**
- Si Rodolfo dice "usa ejército Opus" o "manda agentes"
- Si detectas proyecto complejo (3+ agentes necesarios)
- PROPONER uso si ves oportunidad (no esperar a que pida)

**Archivo de referencia completo:**
Ver `.SPEC/SPEC-26-01-2026-CMS-ContentManager/agents-methodology.md` para detalles completos.
```

---

## 📌 NOTAS DEL ORQUESTADOR (Claude)

**Lo que funcionó muy bien:**
- Briefings focalizados (200 líneas vs 3000)
- Worklog LIFO para trazabilidad
- Rol de arquitecto en vez de implementador
- Velocidad paralela brutal

**Lo que mejoraría:**
- Progress updates al 50% (implementado en esta versión)
- Regla anti-duplicación (implementado)
- Template más rígido (implementado)

**Cuándo NO usar:**
- Tareas simples (<1h)
- 1 solo agente
- SPEC pequeño (<500 líneas)

**Quote para recordar:**
> "5 horas ahora mejor que 20 horas en 10 días" - Rodolfo, 28/01/2026

---

**FIN DEL DOCUMENTO**

**Estado:** BORRADOR EN PRUEBA
**Próximo paso:** Probar en próximas sesiones, refinar si hace falta, agregar a CLAUDE.md cuando validado
