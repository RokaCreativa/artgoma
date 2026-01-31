# 🎯 MISSION-06: API Auto-Traducción IA

**Orquestador:** Claude Sonnet 4.5
**Agente:** Opus
**Prioridad:** CRÍTICA
**Estimación:** 1.5h

---

## 📋 EL PROBLEMA

Karen tiene que traducir manualmente 11 secciones x 5 idiomas = **55 traducciones**.

**Pain point:**
- Copiar de ES manualmente
- Traducir con Google Translate (malo)
- Pegar en cada campo
- Repetir 55 veces

**Tiempo:** 3-4 horas de trabajo tedioso.

---

## 💡 LA SOLUCIÓN (inspirada en IAMenu)

API `/api/translations/auto-translate` que:
1. Detecta qué campos faltan en idioma target
2. Copia contenido de ES (source)
3. Traduce con GPT-4o-mini (~$0.001 por sección)
4. Inserta en BD directamente
5. Invalida cache

**Input:**
```json
{
  "sectionKey": "home",
  "sourceLocale": "es",
  "targetLocale": "en"
}
```

**Output:**
```json
{
  "success": true,
  "fieldsTranslated": 5,
  "cost": "$0.002"
}
```

---

## 📁 ARCHIVOS A CREAR

**1. API Route:**
- `F:\PROYECTOS\ARTGOMA\src\app\api\translations\auto-translate\route.ts`

**Estructura:**
```typescript
export async function POST(req: Request) {
  // 1. Parse body: sectionKey, sourceLocale, targetLocale
  // 2. Cargar contenido source de BD
  // 3. Verificar qué existe en target (para no sobrescribir)
  // 4. Traducir con OpenAI GPT-4o-mini
  // 5. Upsert en BD
  // 6. Revalidar tags
  // 7. Return: fieldsTranslated, cost
}
```

**2. Helper de traducción:**
- `F:\PROYECTOS\ARTGOMA\src\lib\cms\translateContent.ts`

```typescript
export async function translateSectionContent(
  content: object,
  fromLang: string,
  toLang: string
): Promise<object> {
  // Usar OpenAI API con GPT-4o-mini
  // Prompt: "Translate this JSON preserving keys, only translate values"
  // Return: JSON traducido
}
```

---

## 📚 REFERENCIA IAMENU

**Archivo a estudiar:**
- `F:\PROYECTOS\ROKAMENU\src\app\api\translations\ui\sync\route.ts` (si existe)

**Aprender de su implementación:**
- Cómo estructura el prompt de traducción
- Cómo detecta keys faltantes
- Cómo calcula el costo
- Cómo maneja errores

---

## ⚠️ REGLAS ESPECÍFICAS

1. **Usar GPT-4o-mini** - Más barato que Claude ($0.15 vs $3.00 por 1M tokens)
2. **NO sobrescribir** - Si target ya tiene contenido, NO traducir ese campo
3. **Preservar estructura** - JSON traducido debe tener mismas keys
4. **Validar con Zod** - Schema de la sección debe pasar
5. **Auth requerida** - Solo admin puede usar esta API
6. **Rate limiting** - Máximo 10 traducciones/min (evitar abuse)

---

## 🧪 TESTING

**Caso 1: Traducir sección vacía**
```bash
POST /api/translations/auto-translate
{
  "sectionKey": "home",
  "sourceLocale": "es",
  "targetLocale": "en"
}

Esperado:
- Traduce TODOS los campos
- Inserta en BD
- Return fieldsTranslated > 0
```

**Caso 2: Traducir sección parcial**
```bash
# EN ya tiene h1, falta button
Esperado:
- Traduce SOLO button
- Preserva h1 existente
- Return fieldsTranslated = 1
```

**Caso 3: Source no existe**
```bash
# ES no tiene contenido
Esperado:
- Return error: "Source content not found"
```

---

## 🎯 OUTPUT

Reportar en worklog.md:
- API creada (ruta completa)
- Helper creado (ruta completa)
- Modelo IA usado (GPT-4o-mini)
- Costo estimado por traducción
- Testing manual realizado

**CHECKLIST:**
- [ ] TypeScript compila
- [ ] Auth validada
- [ ] Fallback a error si falla
- [ ] Logs de debugging agregados
- [ ] Costo estimado calculado

**STANDBY.**
