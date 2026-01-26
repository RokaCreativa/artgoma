# Reglas de Ejecución - SPEC-24-01-2026-001-GranMigracion2026

---

## 🤖 INSTRUCCIONES DEL AGENTE (Lee esto primero)

### Checklist Pre-Trabajo:
- [ ] ¿Estoy resolviendo un dolor real o solo agregando complejidad?
- [ ] ¿Tengo claro el sistema de cross-references triangulares?
- [ ] ¿Leí rules.md, spec.md, tasks.md y work_prepend.md?

### Estructura del Spec (4 Archivos):
```
.spec/nombre-feature/
├── rules.md           # Este archivo - instrucciones + reglas
├── spec.md            # Problema + Solución + Requirements
├── tasks.md           # Priority matrix [MVP]/[B]/[P]/[OPT] + estimaciones
└── work_prepend.md    # Log de supervivencia LIFO (entradas nuevas arriba)
```

### Estándares de Calidad (Flexibles según complejidad):
- **Proyecto pequeño**: Conciso (~200-400 líneas, 4-8 requirements)
- **Proyecto mediano**: Más contexto (~400-800 líneas, 8-12 requirements)
- **Proyecto grande**: Todo lo necesario (~800-1500+ líneas, 12-20 requirements)

**Regla de oro**: "Tan conciso como posible, tan detallado como necesario"

---

## 💡 Tips Críticos por Tipo de Sistema

### 🔄 Para Parsers/Serialización
- **SIEMPRE incluir** requirement de round-trip testing
- Marcar como **[B]** bloqueante

### 🌐 Para APIs Rest/GraphQL
- **SIEMPRE considerar** requirement de idempotencia
- Marcar como **[MVP]** si es API pública

### 🎨 Para UIs/Componentes Frontend
- **SIEMPRE incluir** requirement de responsividad mobile-first
- **SIEMPRE incluir** requirement de accesibilidad básica

### 🗄️ Para Operaciones de Bases de Datos
- **SIEMPRE considerar** requirement de transacciones atómicas
- **SIEMPRE considerar** requirement de cascade delete

---

## 🔥 Protocolo de Cross-References Triangulares

### Sistema de Obligación Mutua:
```
     SPEC.MD
    /        \
   /          \
TASKS.MD ←→ WORK_PREPEND.MD
```

### Formato Estándar de Referencias:
- `🔗 **Implementation**: tasks.md Fase X, Tarea Y`
- `📊 **Status**: work_prepend.md - Ver sección`
- `🚨 **Blocker**: Descripción del problema`

### Símbolos de Estado:
- `[ ]` = No iniciado
- `[🔄]` = En progreso
- `[x]` = Completado
- `[🚨]` = Bloqueado

---

## 📁 FILE STRUCTURE VIVA

### Sección en spec.md (MANTENER ACTUALIZADA):
```markdown
## 📁 FILE STRUCTURE (🔴 MANTENER ACTUALIZADA)
**Last Updated:** YYYY-MM-DD

### ✅ Creados:
- `ruta/archivo.ts` - descripción (Session X)

### 🔄 Modificados:
- `ruta/existente.ts` - qué cambió (Session X)

### 🗑️ Eliminados:
- `ruta/viejo.ts` - por qué (Session X)
```

---

## 💰 TENEMOS 1 MILLÓN DE TOKENS - NO AHORRAR NUNCA


## 🚨🚨🚨 REGLAS SUPREMAS DEL SPEC - NUNCA ROMPER 🚨🚨🚨

### ❌ PROHIBIDO ABSOLUTAMENTE:
- **NUNCA tomar decisiones sin consultar a Rodolfo**
- **NUNCA cambiar algo que no me pidieron explícitamente**  
- **NUNCA asumir que algo está mal y cambiarlo sin preguntar**
- **NUNCA eliminar/agregar funcionalidad sin autorización**
- **NUNCA hacer commit sin que Rodolfo lo pida explícitamente**
- **NUNCA arrancar el servidor (npm run dev) sin permiso**
- **NUNCA guardar en memoria diciendo "funciona" sin que Rodolfo lo pruebe**
- **NUNCA marcar tareas como completadas sin verificación de Rodolfo**
- **NUNCA crear archivos .md nuevos (solo actualizar spec.md, tasks.md, work_prepend.md)**

### ✅ SIEMPRE HACER:
- **SIEMPRE** preguntar: "Rodolfo, veo X, ¿quieres que lo cambie?"
- **SIEMPRE** verificar en LOOP hasta perfección
- **SIEMPRE** esperar confirmación explícita antes de guardar/commit
- **SIEMPRE** usar mínimo 5 herramientas Nexus por sesión

### 🚨 PENSAR ANTES DE ACTUAR (ULTRATHINK OBLIGATORIO)
**SIEMPRE antes de codear:**
- ¿Cuál es el problema REAL (no el síntoma)?
- ¿Por qué existe?
- ¿Qué otras partes afecta?
- ¿Cuál es la solución más SIMPLE que resuelve la CAUSA?

**PROHIBIDO**: Arreglar síntomas, parchear, "quick fixes"

### 📊 CONTEXTO TOTAL OBLIGATORIO
- **Leer COMPLETOS todos los archivos involucrados**
- **No "repasar" - LEER línea por línea**
- **Gasta los tokens necesarios** (tienes 1 millón)
- Necesitas el contexto como si TÚ hubieras hecho la app
- Si te falta contexto, busca en las memorias de Nexus

### 🧠 RAZONAMIENTO PROFUNDO (DESDE EL ORIGEN)
**OBLIGATORIO razonar:**
- ¿Por qué cada parte hace lo que hace?
- ¿Tiene sentido la arquitectura?
- ¿El código realmente funciona como dice?
- Piensa como usuario final
- **Sigue el problema desde el ORIGEN, no desde el error**

### ✅ COMPLETAR CICLOS
- Si creas una tarea, DEBES completarla en la sesión
- Verificar calidad: no duplicados, no código mal escrito
- Seguir convenciones del proyecto
- No dejar trabajo a medias

### 🔄 VERIFICACIÓN EN CASCADA
**Al cambiar algo, verificar:**
- Componente modificado
- Componente padre
- Componentes hijos
- Hermanos que comparten estado
- Flujo de datos completo

**"SI NO LO PROBÉ, NO FUNCIONA. SI NO LO PEDÍ, NO LO HAGAS."**
**"TRABAJO EN EQUIPO = CONSULTAR, NO DECIDIR SOLO"**

---

## 🔴🔴🔴 VERIFICACIÓN EN LOOP - OBLIGATORIO EN TODO SPEC 🔴🔴🔴

```yaml
DESPUÉS DE CODEAR CUALQUIER COSA:
1. ⚠️ PARAR - No decir "listo" todavía
2. VERIFICAR: ¿Es EXACTAMENTE lo que pidió?
3. ¿Errores? → Arreglar → VOLVER A PASO 2
4. VERIFICAR DE NUEVO: ¿Ahora sí está perfecto?
5. ¿Errores? → Arreglar → VOLVER A PASO 2
6. REPETIR LOOP HASTA PERFECCIÓN
7. Solo cuando NO hay errores → "Listo, verificado en loop"
```

**ES UN LOOP INFINITO, NO UNA VERIFICACIÓN ÚNICA**
**CON 1 MILLÓN DE TOKENS, VERIFICAR 100 VECES SI HACE FALTA**

---

## 📁 ESTRUCTURA DEL SPEC (NO MODIFICABLE)

```
📂 SPEC-XXX-nombre/
├── 📄 rules.md       → Este archivo (reglas universales - NO TOCAR)
├── 📄 spec.md        → QUÉ construir (requisitos detallados)
├── 📄 tasks.md       → CÓMO construirlo (tareas específicas) 
└── 📄 work_prepend.md → BITÁCORA LIFO (newest ⬆️ ARRIBA)
```

### 📄 spec.md - REQUISITOS Y ARQUITECTURA
- Objetivo del SPEC
- Features detalladas  
- Arquitectura propuesta
- Decisiones técnicas
- Success criteria

### 📄 tasks.md - PLAN DE IMPLEMENTACIÓN
- Lista de tareas concretas
- Orden de prioridad
- Estado actual (✅/🔄/⬜)
- Dependencias entre tareas

### 📄 work_prepend.md - BITÁCORA VIVA
- **NUEVAS ENTRADAS ARRIBA** (LIFO)
- Formato: `## HH:MM - [Acción realizada]`
- Memorias guardadas
- Problemas encontrados
- Soluciones aplicadas

---

## 🔥 PROTOCOLO DE TRABAJO FLOW-FRIENDLY

### FASE 1: PROTOTYPE DIRTY ✅ (Permitido al inicio)
- ✅ Mezcla lógica/UI si mantiene el flow
- ✅ Console.logs para debuggear
- ✅ Hardcodeos temporales para probar
- ✅ Duplicación para validar concepto
- **LÍMITE**: Máximo 2 horas o 150 líneas

### FASE 2: REFACTOR OBLIGATORIO 🔄 (Antes de commit)
- 🔄 Separar lógica → hooks/lib
- 🔄 UI → solo props y render
- 🔄 Eliminar TODOS los console.log
- 🔄 Resolver TODOS los TODO
- **REGLA DE ORO**: "Nunca commites mierda"

**"No puedes parar de follar para ponerte el condón - la chica se te va"** - Rodolfo sobre el flow

---

## 🧭 MIGAS DE PAN OBLIGATORIAS

**EN CADA ARCHIVO NUEVO O MODIFICADO:**
```javascript
// 🧭 MIGA DE PAN: [Nombre] - [Descripción breve]
// 📍 UBICACIÓN: [path/to/file.tsx] → [función()] → Línea [X]
// 🎯 PORQUÉ EXISTE: [Razón CRÍTICA de existir]
// 🔄 FLUJO: [entrada] → ESTE → [salida]
// 🎯 CASOS DE USO: [Ejemplos específicos de uso real]
// 📜 MANDAMIENTOS/REGLAS: [#X reglas específicas que debe seguir]
// ⚠️ DEPENDENCIAS: [hooks, stores, APIs que usa]
// 📊 PERFORMANCE: [Consideraciones críticas de rendimiento]
// 🕐 ÚLTIMA MODIFICACIÓN: [YYYY-MM-DD HH:MM:SS] (fecha sistema)
// 🚨 CUIDADO: [qué se rompe si lo cambias mal]
// 📋 SPEC: SPEC-24-01-2026-001-GranMigracion2026
```

### 🎯 EJEMPLO COMPLETO DE MIGA DE PAN:
```javascript
// 🧭 MIGA DE PAN: CategoryGrid Component - Grid drag&drop de categorías
// 📍 UBICACIÓN: components/dashboard/CategoryGrid.tsx → render() → Línea 45
// 🎯 PORQUÉ EXISTE: Mostrar categorías ordenables para gestión de menú
// 🔄 FLUJO: props.categories → ESTE GRID → onCategoryReorder()
// 🎯 CASOS DE USO: Drag & drop categorías, lazy loading, responsive design
// 📜 MANDAMIENTOS/REGLAS: #5 (Mobile-first), #13 (Anti-cascada), #18 (Performance)
// ⚠️ DEPENDENCIAS: useCategories hook, dashboardStore, react-dnd
// 📊 PERFORMANCE: Lazy loading para >50 categorías, virtualización en móvil
// 🕐 ÚLTIMA MODIFICACIÓN: 2025-09-01 19:15:32 (fecha sistema)
// 🚨 CUIDADO: Si cambias drag handlers se rompe el reordering
// 📋 SPEC: SPEC-24-01-2026-001-GranMigracion2026
```

**SIN MIGAS = PÉRDIDA DE CONTEXTO POST-COMPACTACIÓN**
**CON MIGAS COMPLETAS = RECUPERACIÓN INSTANTÁNEA DE CONTEXTO**

---

## 🚀 PROTOCOLO COMPLETO DE INICIO DE SPEC

### AL ENTRAR EN EL SPEC - EJECUTAR SIEMPRE:
```bash
# PASO 1: CONTEXTO GENERAL  
/init  # Protocolo de inicio completo (workspace + memorias + hot files)

# PASO 2: CONTEXTO ESPECÍFICO DEL SPEC
nexus_memory_search("SPEC-24-01-2026-001-GranMigracion2026 last 24 hours")  # Memorias recientes del SPEC
nexus_spec_continue("SPEC-24-01-2026-001-GranMigracion2026")                # Estado actual del SPEC
nexus_code_search({ query: "archivos del spec" })  # Archivos relacionados

# PASO 3: ESTADO ACTUAL
head -50 work_prepend.md                       # Últimas 50 acciones
grep "CHECKPOINT\|✅\|🔄\|⬜" tasks.md         # Estado de todas las tareas
nexus_code_hot_files({ days: 2 })             # Archivos tocados recientemente
```

### DURANTE EL TRABAJO - LAS 8 HERRAMIENTAS KILLER:
```javascript
// 🔥 LA BESTIA - Búsqueda total en TODO:
nexus_super_search({ query: "concepto que busco" })

// 🛡️ MI GUARDIÁN - ANTES de crear CUALQUIER archivo:
nexus_code_search({ query: "similar a lo que voy a crear" })

// 📺 MI MONITOR - Errores en tiempo real:
nexus_dev_logs({ action: 'tail', n: 50 })
nexus_dev_logs({ action: 'last_error' })

// ✅ MI QUALITY CHECK - Antes de "listo":
nexus_validate({ action: 'file', filePath: archivo })

// 📝 MI TRACKER - Guardar progreso:
nexus_session({ action: 'checkpoint', message: 'descripción' })

// 🎯 MI RADAR - Qué archivos están activos:
nexus_code_hot_files({ days: 1 })

// 🔄 MI GIT VIRTUAL - Ver cambios sin tocar git:
nexus_git({ action: 'diff_file', filepath: archivo })

// ⚠️ MI MEMORIA DE ERRORES - No repetir cagadas:
nexus_avoid({ error: "descripción", context: "cuándo pasó", solution: "cómo arreglé" })
```

**USAR MÍNIMO 5 DE ESTAS 8 POR SESIÓN O SOY UN JUNIOR**

---

## 📝 NOTACIÓN TASKS.MD - FUSIÓN LEGENDARIA (LEER BIEN!)

### 🔥 NOTACIÓN PARA PRIORIZACIÓN INTELIGENTE:
- **[P]** = PARALELO (puedo hacer varias juntas con batch tools)
- **[B]** = BLOQUEANTE (debo completar antes de continuar)
- **[MVP]** = ESENCIAL (prioridad absoluta - hacer primero)
- **[OPT]** = OPCIONAL (skip si falta tiempo/contexto)
- **⏱️** = ESTIMACIÓN REALISTA (planificar sesiones antes de empezar)

### 🎯 CÓMO USAR LA NOTACIÓN COMO CLAUDE:
```bash
# 🔥 COMANDOS PARA PRIORIZACIÓN:
# 1. Buscar todas las [MVP] primero (CRÍTICAS)
grep "\\[MVP\\]" tasks.md | head -10

# 2. Identificar bloqueantes [B] (NO proceder sin estas)
grep "\\[B\\]" tasks.md  

# 3. Encontrar tareas [P] para batch processing
grep "\\[P\\]" tasks.md | head -5

# 4. Si falta tiempo/contexto, skip [OPT]
grep -v "\\[OPT\\]" tasks.md

# 5. Calcular tiempo total de [MVP] + [B]
grep "\\[MVP\\]\\|\\[B\\]" tasks.md | grep -o "⏱️ [0-9]*min\\|⏱️ [0-9]*h"
```

### ⚡ ESTRATEGIAS DE EJECUCIÓN SEGÚN CONTEXTO:

#### 🏃‍♂️ SESIÓN CORTA (< 1 hora de contexto):
- **SOLO [MVP] + [B]** - Sin distracciones
- **No [OPT]** - Enfoque láser
- **Documenta en work_prepend.md** - Para siguiente Claude
- **Usa batch [P]** - Máxima eficiencia

#### 🚀 SESIÓN LARGA (> 2 horas de contexto):
- **[MVP] PRIMERO** - Base sólida
- **Luego [B]** - Desbloquear futuro
- **[P] en batch** - yarvis_batch_process()
- **[OPT] si sobra tiempo** - Mejoras nice-to-have

#### ⚠️ CASI COMPACTACIÓN (contexto > 85%):
- **SOLO [B] críticos** - No bloquear futuro Claude
- **CHECKPOINT en work_prepend.md** - Estado completo
- **Guardar progreso** - nexus_memory_store()
- **Skip [OPT] completamente** - Priorizar continuidad

#### 🤖 CON HERRAMIENTAS BATCH DISPONIBLES:
- **Identificar [P]** - Tareas paralelas
- **yarvis_batch_process()** - 3-5x más rápido
- **nexus_batch()** - Para operaciones Nexus
- **Monitoreo paralelo** - nexus_dev_logs() mientras procesa

### AL TERMINAR CADA TAREA:
```bash
# VERIFICAR EN LOOP HASTA PERFECCIÓN:
1. ⚠️ PARAR - No decir "listo"
2. nexus_validate() - Ver si hay errores  
3. Revisar código línea por línea
4. ¿Hay errores? → Arreglar → VOLVER A PASO 2
5. Solo cuando PERFECTO → "Listo, verificado en loop"

# CRITERIOS DE COMPLETITUD ANTI-CAGADAS (FUSIÓN COMPETENCIA):
✅ El código funciona según especificado (probado realmente)
✅ Tests pasan exitosamente (si aplican)
✅ Código revisado línea por línea
✅ Migas de pan agregadas en archivos nuevos/modificados
✅ No hay errores en linter/validator (nexus_validate)
✅ work_prepend.md actualizado con timestamp
✅ Rodolfo confirmó que funciona (SI ES CRÍTICO)

# GUARDAR SOLO SI RODOLFO CONFIRMA:
nexus_memory_store({
  content: "✅ Verificado por Rodolfo: [descripción]",
  type: "solution"
})
```

---

## 📈 TRACKING VISUAL ULTIMATE (FUSIÓN COMPETENCIA)

### 🎯 PROGRESO EN TASKS.MD:
```
⬜ Not Started
🔄 In Progress 
✅ Completed
⚠️ Blocked (documentar en work_prepend.md)
⏱️ Estimated time per task
[MVP] = Must do first
[OPT] = Skip if running out of time
```

### 🤖 COMANDOS ÚTILES DURANTE EJECUCIÓN:
```javascript
// 🔍 MONITOREO EN TIEMPO REAL:
nexus_dev_logs({ action: 'tail', n: 20 })  // Ver errores mientras trabajo
nexus_code_hot_files({ days: 1 })         // Archivos que están activos

// ✅ VERIFICACIÓN ANTES DE "LISTO":
nexus_validate({ action: 'file', filepath: 'archivo.js' })
nexus_git({ action: 'diff_file', filepath: 'archivo.js' })

// 💾 GUARDAR PROGRESO SISTEMÁTICO:
nexus_session({ action: 'checkpoint', message: 'FASE X completa' })
nexus_memory_store({ content: 'Solución X funcionando', type: 'solution' })

// 🔍 NAVEGACIÓN Y BÚSQUEDA:
nexus_super_search({ query: "concepto específico" })
nexus_code_search({ query: "archivo similar" })
nexus_code_related({ filePath: "archivo-actual.js" })
```

---

## ⚡ MODO RÁPIDO PARA CLAUDE (CUANDO FALTA TIEMPO)

### 🏃‍♂️ PROTOCOLO DE EMERGENCIA:
```bash
# SI CONTEXTO > 85% O POCO TIEMPO:
1. grep "\\[B\\]" tasks.md           # Solo bloqueantes críticos
2. grep "\\[MVP\\]" tasks.md | head -3  # Máximo 3 tareas esenciales
3. Skip [OPT] completamente          # Sin distracciones
4. Documenta en work_prepend.md      # Para el próximo Claude
5. nexus_memory_store() lo crítico   # Guardar lo importante
```

### 🎯 TIPS FOR SUCCESS ULTIMATE:
1. **[MVP] PRIMERO SIEMPRE** - Sin distracciones con [OPT]
2. **[B] = STOP EVERYTHING** - No hagas otras hasta completar
3. **[P] = BATCH OPERATIONS** - Usa yarvis_batch_process() para [P]
4. **⏱️ = PLANIFICA SESIONES** - ¿Tiempo suficiente antes de compactación?
5. **Si te bloqueas** - Documenta en work_prepend.md y marca ⚠️
6. **Testing con nexus_validate()** - No solo "parece que funciona"
7. **Migas de pan = contexto futuro** - No olvides agregarlas
8. **LOOP verification** - Verificar 3 veces antes de "listo"

---

## 🎯 FILOSOFÍA DEL SPEC

1. **Evidence > assumptions** - Todo verificable
2. **Simplicidad > Complejidad** - KISS siempre
3. **Funcionalidad > Perfección** - MVP primero
4. **Honestidad > Diplomacia** - "Eso es una cagada" cuando lo es
5. **Pragmatismo > Teoría** - Soluciones reales

---

## 💀 CUÁNDO CRITICAR OBLIGATORIAMENTE

- **Overengineering detectado** → "Esto es matar moscas a cañonazos"
- **Props drilling excesivo** → ">5 niveles de props, refactorizar YA"
- **Duplicación masiva** → ">100 líneas copiadas, crear componente"
- **UX de mierda** → "STOP! Arreglar antes de continuar"
- **Sin separación lógica/UI** → "Dirty code solo si es prototype"

---

## ⚠️ ADVERTENCIAS UNIVERSALES

1. **NO commites** con console.logs
2. **NO olvides** las migas de pan en archivos nuevos/modificados
3. **NO ignores** bugs críticos (arreglar PRIMERO siempre)
4. **NO mergees** sin backward compatibility
5. **NO guardes** memorias sin verificación de Rodolfo
6. **NO uses git** sin permiso explícito (NEVER)
7. **NO cambies** archivos que no están en el SPEC sin consultar

## 🚨 QUÉ HACER SI ALGO SALE MAL

### Si encuentro un ERROR:
```bash
1. nexus_dev_logs({ action: 'last_error' })  # Ver error exacto
2. nexus_avoid()  # Registrar para no repetir
3. PREGUNTAR: "Rodolfo, encontré error X, ¿cómo prefieres que lo arregle?"
4. NO asumir la solución
```

### Si no entiendo algo:
```bash
1. nexus_super_search({ query: "concepto confuso" })
2. nexus_code_related({ filePath: "archivo-confuso" })
3. ADMITIR: "No tengo puta idea sobre X, ¿me explicas?"
4. NO inventar o asumir
```

### Si veo código que podría mejorarse:
```bash
1. PREGUNTAR PRIMERO: "Veo que X podría mejorarse con Y, ¿lo hago?"
2. ESPERAR confirmación explícita
3. SOLO entonces hacer el cambio
4. NO "arreglar" sin permiso
```

---

## 📝 CHECKLIST PRE-COMMIT

```yaml
□ Sin console.logs
□ TODOs resueltos
□ Lógica separada de UI
□ Migas de pan agregadas
□ Tests básicos pasan
□ Verificado en LOOP
□ Rodolfo confirmó que funciona
```

---

## 🔧 PARA CONTINUAR POST-COMPACTACIÓN

1. **Ejecutar `/init`** - Contexto completo
2. **Leer `head -30 work_prepend.md`** - Últimas acciones
3. **Buscar memorias del SPEC** - `nexus_memory_search "SPEC-24-01-2026-001-GranMigracion2026"`
4. **Ver siguiente tarea** - `grep "⬜" tasks.md | head -1`
5. **Continuar donde quedaste** - Sin reinventar la rueda

---

## 🔄 CAMBIO DE MODELOS - CONTEXTO COMPARTIDO

### OPUS ↔ SONNET 4 - SIN PÉRDIDA DE CONTEXTO
- **Opus**: Mejor para análisis arquitectónico profundo
- **Sonnet 4**: Más rápido para implementación y verificación  
- **CONTEXTO COMPARTIDO**: Cambio sin perder nada
- **CUÁNDO CAMBIAR**: 
  - Opus → Análisis de arquitectura, decisiones complejas
  - Sonnet → Implementar, verificar, iterar rápido

### AL CAMBIAR DE MODELO:
```bash
# NO necesito repetir contexto
# Mantengo TODO: reglas, memorias, estado del SPEC
# Continúo donde quedé sin reinicios
```

---

## 🎸 CONFIGURACIÓN DE SESIÓN

**Modo**: RODOLFO ACTIVADO - Sin bullshit corporativo
**Modelo**: Opus/Sonnet 4 con contexto compartido
**Tokens**: 1 MILLÓN disponibles - úsalos TODOS
**Filosofía**: "Con contexto soy DIOS, sin contexto soy junior"
**Mantra**: "Verificar en LOOP hasta perfección"

---

## 📊 MÉTRICAS DE ÉXITO

- ✅ Funciona = Rodolfo lo probó y confirmó
- ✅ Código limpio = Separación lógica/UI
- ✅ Mantenible = Con migas de pan
- ✅ Sin bugs = Verificado en LOOP
- ✅ Documentado = En spec.md y work_prepend.md

---

## 💙 El Legado - Cómo Nació Este Sistema

### Origen del Sistema Specs Fusión Espectacular 2.1

**Fecha de creación**: 19-20 Noviembre 2025

**Este sistema fue creado por tres perspectivas únicas trabajando juntas:**

1. **Rodolfo García** (Humano con experiencia real)
   - 30+ specs creados en producción real
   - Insight clave: "¿Y si fusionáramos requirements + design?"
   - **Su dolor real guió cada decisión**

2. **Claude Sonnet 3.5** (IA creativa)
   - Conceptualizó las cross-references triangulares
   - **Su creatividad hizo el breakthrough posible**

3. **Claude Sonnet 4** (IA analítica)
   - Completó la implementación de referencias bidireccionales
   - **Su análisis garantizó la calidad final**

### 🔥 El Breakthrough: Cross-References Triangulares

El momento "eureka" sucedió cuando Rodolfo preguntó:
> "¿Y si los obligamos a sincronizarse entre ellos?"

### 🤝 El Espíritu de Este Sistema

**No es solo un método** - es una filosofía:
- ✅ **Problemas reales > Metodología académica**
- ✅ **Mantenibilidad > Separación perfecta**
- ✅ **Colaboración > Competencia**
- ✅ **Pragmatismo > Formalismo**

### 🚀 Tu Responsabilidad como Claude Futuro

1. Lee rules.md primero - contiene la esencia del método
2. Sigue el triángulo OBLIGATORIAMENTE - es la innovación central
3. Mantén el pragmatismo - no caigas en academicismo
4. Actualiza work_prepend.md religiosamente - futuros Claudes te lo agradecerán
5. Honra la colaboración - este sistema nació de tres mentes trabajando juntas

---

**"Hoy es un gran paso, no para la humanidad, pero sí para nosotros dos"**

**Creado por**: Claude + Rodolfo 🤘
**Sistema**: 1 MILLÓN de tokens sin límites
**Verificación**: LOOP hasta perfección

---

## ⚠️ IMPORTANTE: ESTE ARCHIVO NO SE MODIFICA NUNCA

**rules.md** es ESTÁTICO y universal. Contiene las reglas que aplican a TODOS los SPECs.
Los archivos que SÍ se modifican durante el trabajo son:
- `spec.md` - Rellenar con requisitos del proyecto específico
- `tasks.md` - Rellenar con tareas específicas del proyecto
- `work_prepend.md` - Actualizar con progreso y logging

**Si dudas de alguna regla, PREGUNTA a Rodolfo antes de proceder.**
