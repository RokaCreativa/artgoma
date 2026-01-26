# SPEC: SPEC-24-01-2026-001-GranMigracion2026

<!--
╔══════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ 🤖 CABECERA PARA CLAUDE (CONTEXTO RÁPIDO)                                                            ║
╠══════════════════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                                      ║
║ 📍 QUÉ ES ESTO:                                                                                      ║
║ [Una frase que resume el propósito CRÍTICO de este componente/spec]                                  ║
║                                                                                                      ║
║ 🏗️ ARQUITECTURA:                                                                                     ║
║ [Componente A] -> [Componente B] -> [Salida]                                                         ║
║ (Source of Truth: XXXXXXX)                                                                           ║
║                                                                                                      ║
║ 📂 ARCHIVOS CLAVE:                                                                                   ║
║ - src/... (Principal)                                                                                ║
║ - src/... (Utils)                                                                                    ║
║                                                                                                      ║
║ ⚠️ DEPENDENCIAS CRÍTICAS / SISTEMAS RELACIONADOS:                                                    ║
║ [Ojo con tocar X porque rompe Y]                                                                     ║
║                                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════╝
-->

## Problema

Actualmente el proyecto ARTGOMA corre sobre un stack tecnológico de 2024 (Next.js 14, React 18, Tailwind 3) que, a fecha de enero de 2026, acumula 2 años de deuda técnica. 
Esto dificulta la mantenibilidad, impide el uso de nuevas features de Vercel/Next (como el compilador Turbopack estable o las Server Actions v2), y expone el sistema a vulnerabilidades de seguridad en dependencias obsoletas. Además, se planea agregar un Admin Panel complejo, lo cual es el momento ideal para modernizar la base.

Los puntos de dolor principales son:
- **Obsolescencia**: Librerías core (React, Next, Prisma) con versiones major atrasadas.
- **Rendimiento**: Se pierden mejoras del compilador de React 19 y Next 16.
- **Acumulación de Deuda**: Si no se actualiza ahora, en 2 años será una reescritura total.

## Solución

Ejecutar una "Gran Migración 2026" controlada y por fases para llevar todo el stack a sus versiones estables más recientes (LTS 2026).

**Innovaciones clave:**
- **React 19**: Uso del nuevo compilador automático (adiós `useMemo` manual obsesivo).
- **Next.js 16**: Aprovechar el nuevo modelo de caching simplificado y Server Actions mejoradas.
- **Tailwind 4**: Motor CSS oxidado (Rust) para compilación instantánea.
- **Prisma 7**: Mejor performance en queries y drivers serverless nativos.

---

## 📁 FILE STRUCTURE (🔴 MANTENER ACTUALIZADA)

**Last Updated:** 2026-01-24 (Post-Migración Fase 2)

### ✅ Creados:
- `.SPEC/.../spec.md`
- `.SPEC/.../tasks.md`
- `.SPEC/.../work_prepend.md`
- `prisma.config.ts` (Nueva config Prisma 7)

### 🔄 Modificados:
- `package.json` (Next 16, React 19, Tailwind 4, Prisma 7)
- `next.config.js` (RemotePatterns, Next 16 config)
- `postcss.config.mjs` (Plugin @tailwindcss/postcss)
- `src/app/globals.css` (Migración a CSS Variables nativas)
- `src/lib/supabase.ts` (Cliente seguro para build)
- `src/app/[lang]/**/*.tsx` (Migración Async Params masiva)
- `prisma/schema.prisma` (Eliminado datasource url)

### 🗑️ Eliminados:
- Ninguno

---

## Requirements

### 1. Migración Base y Dependencias (Next 16 + React 19)

**Problema**: Proyecto atrapado en Next 14 y React 18.

**Solución**: Actualizar `package.json` y resolver breaking changes de React 19 (refs, context, actions).

- CUANDO se ejecute `npm install`, ENTONCES no debe haber conflictos de peer dependencies.
- El sistema DEBE compilar (`npm run build`) sin errores de tipos en React 19.
- El sistema DEBE arrancar (`npm run dev`) sin crashear.

🔗 **Implementation**: tasks.md Fase 1, Tarea 1 y 2
📊 **Status**: work_prepend.md
🚨 **Blocker**: Ninguno

### 2. Migración de Estilos (Tailwind 4)

**Problema**: Tailwind 3 depende de postcss y es más lento.

**Solución**: Migrar a Tailwind 4 (motor Rust) y actualizar config.

- CUANDO se compile CSS, ENTONCES debe usar el nuevo engine v4.
- El sistema DEBE mantener la identidad visual exacta (sin romper estilos).
- SI hay plugins legacy incompatible, ENTONCES buscar reemplazo o workaround.

🔗 **Implementation**: tasks.md Fase 2, Tarea 3
📊 **Status**: work_prepend.md
🚨 **Blocker**: Depende de Fase 1

### 3. Migración de Datos (Prisma 7 + Supabase)

**Problema**: Prisma 5 pierde optimizaciones recientes.

**Solución**: Actualizar Prisma a v7 y regenerar cliente.

- CUANDO se ejecute `npx prisma generate`, ENTONCES debe crear el cliente v7.
- Las queries existentes DEBEN seguir funcionando (backward compatibility).

🔗 **Implementation**: tasks.md Fase 2, Tarea 4
📊 **Status**: work_prepend.md
🚨 **Blocker**: Ninguno

### 4. Validación de Flujos Críticos (Sanity Check)

**Problema**: Las actualizaciones major suelen romper lógica de negocio silenciosamente (auth, uploads).

**Solución**: Verificar manualmente los flujos críticos.

- CUANDO un usuario hace login, ENTONCES debe funcionar (NextAuth compatible).
- CUANDO se sube una imagen (API nueva), ENTONCES debe persistir en Supabase.
- El carousel y formularios DEBEN responder igual que antes.

🔗 **Implementation**: tasks.md Fase 3, Tarea 7
📊 **Status**: work_prepend.md
🚨 **Blocker**: Crítico para release

---

## Implementación

### Componentes Principales

<!-- Lista los componentes/módulos principales que se van a crear o modificar -->
- **[NombreComponente1]**: [Descripción de lo que hace y por qué es necesario]
- **[NombreComponente2]**: [Descripción de lo que hace]
- **[NombreComponente3]**: [Descripción de lo que hace]

### Estructura de Archivos

```
src/
├── components/
│   ├── [Feature]/
│   │   ├── [Feature].tsx           # Componente principal (CREATE)
│   │   ├── [Feature]Modal.tsx      # Modal si aplica (CREATE)
│   │   └── index.ts                # Exports (CREATE)
├── hooks/
│   └── use[Feature].ts             # Hook custom (CREATE)
├── services/
│   └── [feature]Service.ts         # Lógica de negocio (CREATE)
├── stores/
│   └── [feature]Store.ts           # Estado global si aplica (CREATE)
└── types/
    └── [feature].types.ts          # Tipos TypeScript (CREATE)
```

### APIs y Servicios

- **[ServiceName]**: [Descripción de lo que orquesta y endpoints que expone]
- **[AnotherService]**: [Lo que hace]

### Modelos de Datos

```typescript
interface [MainInterface] {
  id: string;
  // Agregar campos específicos según necesidad del proyecto
  createdAt: Date;
  updatedAt: Date;
}

interface [StateInterface] {
  data: [MainInterface][];
  loading: boolean;
  error: Error | null;
}
```

---

## Estándares de Calidad

- **Longitud del spec**: Lo necesario según complejidad (200-400 líneas típico)
- **Requirements**: 6-8 para proyectos medianos, hasta 15 para complejos
- **Lenguaje**: Directo y práctico, evitar jerga académica innecesaria
- **Mantenibilidad**: Fácil de actualizar cuando los requirements cambien
- **Trazabilidad**: Camino claro de problema → solución → implementación
- **Cross-references**: SIEMPRE incluir 🔗📊🚨 en cada requirement
- **Regla de oro**: "Tan conciso como posible, tan detallado como necesario"

## Métricas de Éxito

- [ ] Spec legible y comprensible en la primera pasada
- [ ] Plan de implementación accionable con estimaciones realistas
- [ ] Contexto preservado a través de sesiones de agente (cross-references funcionando)
- [ ] Feedback del usuario integrado suavemente
- [ ] Tiempo total de idea a implementación funcionando minimizado
- [ ] Todos los requirements tienen sus cross-references triangulares

---

**Nivel**: DEFAULT (Tan conciso como posible, tan detallado como necesario)
**Ejemplos similares**: Bug fixes, features, sistemas complejos - todo en un formato
**Cross-references**: spec.md ↔ tasks.md ↔ work_prepend.md (SINCRONIZACIÓN OBLIGATORIA)
