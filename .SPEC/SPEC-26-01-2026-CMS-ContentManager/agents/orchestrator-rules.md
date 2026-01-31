# 🎯 REGLAS DEL ORQUESTADOR (Claude que lanza agentes)

**Versión:** 1.0
**Para:** Claude Sonnet/Opus que orquesta agentes
**NO para:** Los agentes ejecutores (ellos leen `agent-rules.md`)

---

## CUÁNDO LANZAR AGENTES

✅ **SÍ usar agentes cuando:**
- 3+ tareas independientes en paralelo
- Proyecto complejo >1000 líneas SPEC
- Estimación >3h trabajo secuencial
- Múltiples frentes (textos + imágenes + configs)

❌ **NO usar agentes cuando:**
- Tarea simple <1h
- 1 solo archivo a modificar
- Fix rápido
- SPEC pequeño (<500 líneas)

**Regla:** Si explicas la tarea en <100 palabras, NO necesitas briefing.

---

## SETUP ANTES DE LANZAR (15 min)

**1. Investigar yo mismo:**
- Leer archivos clave
- Entender el problema
- Validar que es complejo

**2. Diseñar misiones:**
- Identificar frentes independientes
- Crear 1 briefing por agente
- Dependencias claras

**3. Crear estructura:**
```bash
.SPEC/SPEC-XXX/agents/
├── orchestrator-rules.md  ← Este archivo
├── agent-rules.md         ← Para ejecutores
├── briefing.md            ← Contexto general
├── worklog.md             ← Reportes LIFO
├── mission-01-xxx.md      ← Briefing específico
├── mission-02-xxx.md
└── ...
```

---

## LANZAR AGENTES

**Prompt template:**
```
LEE ESTOS 3 ARCHIVOS (OBLIGATORIO):
1. F:\...\agents\agent-rules.md
2. F:\...\agents\briefing.md
3. F:\...\agents\mission-XX-xxx.md

MISIÓN: [Descripción 1 línea]

[Detalles específicos]

REPORTA EN: F:\...\agents\worklog.md (LIFO - arriba)
**STANDBY**
```

**Paralelo:**
- Lanzar todos en 1 mensaje (Task + Task + Task)
- Background: true si no necesitas resultado inmediato

---

## SUPERVISIÓN

**Mientras agentes trabajan:**
- Hacer otras cosas (no esperar idle)
- Leer progress si hace falta (`tail worklog.md`)
- NO intervenir mid-task (dejarlos terminar)

**Cuando reportan:**
- Leer worklog.md (LIFO - nuevos arriba)
- Verificar checklist completo
- TypeScript check si hace falta

---

## CONSOLIDACIÓN FINAL

**Al terminar todos:**

1. Leer todos los reportes en `worklog.md`
2. Extraer lo importante
3. Crear entrada ÚNICA en `work_prepend.md` principal:

```markdown
### [FECHA] - SESIÓN MULTI-AGENTE: [Título]

**X agentes Opus ejecutados:**
- MISSION-01: [Resultado breve]
- MISSION-02: [Resultado breve]

**Archivos críticos:**
- [Lista consolidada]

**Impacto:**
- [Qué cambió para usuario]

**🔗 Spec ref:** ...
```

4. **Opcional:** Borrar `agents/` folder (ya fusionado)

---

## ANTI-PATRONES

❌ **NO hacer:**
- Lanzar agentes para tareas triviales
- Briefings de 1000+ líneas (derrota el propósito)
- Intervenir mientras trabajan
- Duplicar trabajo entre agentes

✅ **SÍ hacer:**
- Setup claro (15 min vale la pena)
- Misiones independientes
- Supervisión al final
- Consolidar al SPEC

---

**FIN - ORCHESTRATOR RULES**
