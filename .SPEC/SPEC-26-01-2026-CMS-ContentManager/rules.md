# Reglas de Ejecución - SPEC-26-01-2026-CMS-ContentManager

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

### Estándares de Calidad:
- **Proyecto mediano**: ~400-800 líneas, 8-12 requirements
- **Regla de oro**: "Tan conciso como posible, tan detallado como necesario"

---

## 💡 Tips Críticos - CMS/Panel Admin

### 🎨 Para UIs/Componentes Frontend
- **SIEMPRE incluir** requirement de responsividad mobile-first
- **SIEMPRE incluir** requirement de accesibilidad básica
- **UI bonita y usable** - NADA de WordPress feo

### 🗄️ Para Operaciones de Bases de Datos
- **SIEMPRE considerar** requirement de transacciones atómicas
- **SIEMPRE considerar** requirement de cascade delete

### 🌐 Para APIs/Server Actions
- **SIEMPRE considerar** validación con Zod
- **SIEMPRE considerar** manejo de errores consistente

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

---

## 🚨 REGLAS SUPREMAS - NUNCA ROMPER

### ❌ PROHIBIDO:
- **NUNCA** tomar decisiones sin consultar a Rodolfo
- **NUNCA** cambiar algo fuera del scope del SPEC
- **NUNCA** guardar memoria diciendo "funciona" sin prueba real
- **NUNCA** crear archivos .md adicionales (solo spec.md, tasks.md, work_prepend.md)

### ✅ SIEMPRE:
- **SIEMPRE** verificar en LOOP hasta perfección
- **SIEMPRE** preguntar antes de cambios no solicitados
- **SIEMPRE** usar mínimo 5 herramientas Nexus por sesión

---

## 🔴 VERIFICACIÓN EN LOOP - OBLIGATORIO

```yaml
DESPUÉS DE CODEAR:
1. ⚠️ PARAR - No decir "listo"
2. VERIFICAR: ¿Es EXACTAMENTE lo pedido?
3. ¿Errores? → Arreglar → VOLVER A PASO 2
4. REPETIR HASTA PERFECCIÓN
5. Solo cuando NO hay errores → "Listo, verificado en loop"
```

---

## 🧭 MIGAS DE PAN OBLIGATORIAS

**EN CADA ARCHIVO NUEVO:**
```javascript
// 🧭 MIGA DE PAN: [Nombre] - [Descripción]
// 📍 UBICACIÓN: [path/to/file.tsx]
// 🎯 PORQUÉ EXISTE: [Razón]
// 🔄 FLUJO: [entrada] → ESTE → [salida]
// 🚨 CUIDADO: [qué se rompe si lo cambias]
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager
```

---

## 🎯 FILOSOFÍA DEL SPEC

1. **UI bonita > funcional fea** - Karen (super user) merece algo bien hecho
2. **YouTube embed > subir videos** - CDN gratis, sin storage costs
3. **Template-ready** - Reutilizable para otros proyectos
4. **Fases incrementales** - MVP primero, mejoras después
5. **Login hardcodeado temporal** - kl@roka.es / Test1234

---

## ⚠️ ESTE ARCHIVO NO SE MODIFICA

**rules.md** es ESTÁTICO. Los archivos que SÍ se modifican:
- `spec.md` - Requisitos del CMS
- `tasks.md` - Tareas específicas
- `work_prepend.md` - Progreso y logging

---

**SPEC**: SPEC-26-01-2026-CMS-ContentManager
**Creado**: 26/01/2026
**Autor**: Claude + Rodolfo 🤘
