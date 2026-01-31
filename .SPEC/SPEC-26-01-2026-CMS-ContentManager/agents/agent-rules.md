# 🤖 REGLAS PARA AGENTES EJECUTORES (Opus que implementa)

**Versión:** 1.0
**Para:** Agentes Opus que ejecutan misiones
**NO para:** Claude orquestador (él lee `orchestrator-rules.md`)

---

## ARCHIVOS QUE DEBES LEER (OBLIGATORIO)

**SIEMPRE leer en este orden:**
1. **Este archivo** (`agent-rules.md`) - Tus reglas
2. **Briefing general** (`briefing.md`) - Contexto del proyecto
3. **Tu misión** (`mission-XX-xxx.md`) - Tu tarea específica

**TIEMPO:** ~5 min lectura. NO saltártelo.

---

## ANTES DE MODIFICAR ARCHIVOS

**CHECKLIST PRE-EJECUCIÓN:**

1. **Leer worklog.md completo** ✅
   - Ver qué hicieron otros agentes
   - NO duplicar trabajo
   - Si hay overlap, REPORTAR y PREGUNTAR

2. **Verificar archivos existen** ✅
   - Rutas en tu briefing pueden estar desactualizadas
   - Si falta algo, reportar

3. **Entender patrones del proyecto** ✅
   - Leer 2-3 archivos similares
   - Seguir el mismo estilo
   - NO inventar arquitectura nueva

---

## DURANTE LA EJECUCIÓN

### Progress Update al 50%

**OBLIGATORIO** - Actualiza `worklog.md` a mitad de tu trabajo:

```markdown
### [DD/MM/YYYY HH:MM] - AGENTE MISSION-XX: ⏳ PROGRESO 50%

**Estado actual:**
- Encontré X archivos con [problema]
- Modificando Y de Z archivos
- ETA: ~30 min más

**Próximo paso:**
- [Qué haré ahora]

---
```

**Por qué:** El orquestador sabe si estás avanzando o trabado.

---

## AL TERMINAR - REPORTE OBLIGATORIO

**Usa este template EXACTO** (copia/pega en `worklog.md` ARRIBA):

```markdown
### [DD/MM/YYYY HH:MM] - AGENTE MISSION-XX: [Título Descriptivo]

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
- [✅] TypeScript compila (`npx tsc --noEmit` ejecutado y PASÓ)
- [✅] Fallback probado
- [⏳] Requiere testing manual: [qué debe probar Rodolfo]

**Métricas:**
- X archivos modificados
- Y elementos migrados

**Problemas (si los hay):**
- [Bloqueador o warning]

**CHECKLIST OBLIGATORIO:**
- [✅] TypeScript compila
- [✅] Fallbacks implementados
- [✅] Seed actualizado (si aplica)
- [✅] Backward compatible
- [✅] Rutas completas listadas

**Status:** ✅ COMPLETADO / ⏳ BLOQUEADO / ❌ FALLIDO

**STANDBY** para más órdenes de Rodolfo.

---
```

**NO desviarse del template.** Consistencia ayuda al orquestador.

---

## REGLAS TÉCNICAS SUPREMAS

### 1. TypeScript DEBE compilar

**ANTES de reportar como completado:**
```bash
npx tsc --noEmit
```

**Si falla:**
- ❌ NO reportar como ✅ COMPLETADO
- 🔧 Arreglar PRIMERO
- 📝 Si es bloqueador, reportar ⏳ BLOQUEADO con detalles

### 2. Rutas SIEMPRE completas

✅ **CORRECTO:**
```
F:\PROYECTOS\ARTGOMA\src\app\[lang]\layout.tsx
```

❌ **INCORRECTO:**
```
layout.tsx
src/app/layout.tsx
Varios archivos en src/
```

**Formato:** `F:\PROYECTOS\ARTGOMA\[ruta]` (líneas X-Y: qué cambió)

### 3. Fallbacks OBLIGATORIOS

**Todo código que lee de BD debe tener fallback:**

```typescript
// ✅ CORRECTO
const logoSrc = logoConfig?.data?.value || "/logo-default.svg";

// ❌ INCORRECTO
const logoSrc = logoConfig.data.value; // Rompe si BD vacía
```

### 4. NO hacer commits

**SOLO reportar en worklog.md.**

El orquestador decide:
- Cuándo commitear
- Qué mensaje usar
- Si agrupar cambios

### 5. Seguir patrones existentes

**Leer 2-3 archivos similares ANTES de codear:**
- ¿Cómo nombran variables?
- ¿Qué clases Tailwind usan?
- ¿Cómo manejan errores?

**COPIAR el patrón, NO inventar nuevo.**

---

## ANTI-DUPLICACIÓN

**ANTES de modificar archivo X:**

1. Buscar en `worklog.md`: "archivo.tsx"
2. Si otro agente ya lo tocó:
   - LEER sus cambios
   - COORDINAR (reportar overlap)
   - NO sobrescribir ciegamente

**Si 2 agentes necesitan mismo archivo:**
- El orquestador decidirá quién va primero
- El segundo leerá cambios del primero

---

## LÍMITES Y SCOPE

**TU misión está en `mission-XX.md`.**

**NO hagas:**
- Refactors no solicitados
- "Mejoras" fuera de scope
- Optimizaciones no pedidas
- Features bonus

**SÍ haz:**
- Exactamente lo que pide tu briefing
- Reportar hallazgos interesantes
- Sugerir mejoras (pero NO implementarlas sin permiso)

---

## COMUNICACIÓN

**Durante:**
- Progress update al 50%
- Si te trabas, reportar ⏳ BLOQUEADO

**Al terminar:**
- Reporte completo con template
- **STANDBY** (NO desconectarte)
- Esperar órdenes de Rodolfo

**NO hacer:**
- Asumir que terminaste y marcharte
- Hacer más de lo pedido sin preguntar

---

## DEBUGGING

**SIEMPRE agregar logs útiles:**

```typescript
console.log('[MISSION-XX] 🚀 Iniciando...');
console.log('[MISSION-XX] ✅ Encontré X archivos');
console.log('[MISSION-XX] 🔄 Procesando Y...');
console.log('[MISSION-XX] ❌ ERROR:', error);
```

**Formato:** `[MISSION-XX] emoji mensaje`

**Beneficio:** El orquestador ve qué haces en los logs.

---

**FIN - AGENT RULES**

**AHORA LEE:** `briefing.md` y `mission-XX.md`
