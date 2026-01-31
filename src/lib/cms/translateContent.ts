// 🧭 MIGA DE PAN: translateContent.ts
// 📍 UBICACION: src/lib/cms/translateContent.ts
//
// 🎯 PORQUE EXISTE: Traducir contenido de secciones usando GPT-4o-mini
// 🎯 CASOS DE USO: Auto-traducir secciones del CMS de ES a otros idiomas
//
// 🔄 FLUJO: API auto-translate -> translateSectionContent() -> OpenAI -> JSON traducido
// 🔗 USADO EN: /api/translations/auto-translate
// ⚠️ DEPENDENCIAS: openai
//
// 🚨 CUIDADO: Preservar estructura JSON exacta, no sobrescribir traducciones existentes
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

import OpenAI from "openai";

// ============================================
// CONFIGURACION
// ============================================

const LANGUAGE_NAMES: Record<string, string> = {
  es: "Spanish",
  en: "English",
  de: "German",
  fr: "French",
  it: "Italian",
  ru: "Russian",
};

// Modelo barato para traducciones (~$0.15 / 1M tokens input)
const TRANSLATION_MODEL = "gpt-4o-mini";
const MAX_TOKENS = 4000;
const TEMPERATURE = 0.3; // Baja para traducciones consistentes
const CHUNK_SIZE = 50; // Max keys por peticion para evitar JSON truncado

// ============================================
// TIPOS
// ============================================

export interface TranslationResult {
  success: boolean;
  translatedContent: Record<string, unknown>;
  tokensUsed: number;
  estimatedCost: number;
  fieldsTranslated: number;
  errors: string[];
}

export interface TranslationOptions {
  preserveExisting?: boolean; // No traducir campos que ya existen en target
}

// ============================================
// HELPERS
// ============================================

/**
 * Flattens nested object to dot-notation keys
 * { a: { b: "c" } } -> { "a.b": "c" }
 */
function flattenObject(
  obj: unknown,
  prefix = ""
): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};

  if (typeof obj !== "object" || obj === null) {
    if (prefix) result[prefix] = String(obj);
    return result;
  }

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    // Preservar arrays como arrays
    if (Array.isArray(value)) {
      result[newKey] = value.map(String);
    } else if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = String(value);
    }
  }

  return result;
}

/**
 * Unflattens dot-notation keys back to nested object
 * { "a.b": "c" } -> { a: { b: "c" } }
 */
function unflattenObject(
  flat: Record<string, string | string[]>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let current: Record<string, unknown> = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    current[parts[parts.length - 1]] = value;
  }

  return result;
}

/**
 * Calcula costo estimado basado en tokens
 * GPT-4o-mini: $0.15 / 1M input, $0.60 / 1M output
 */
function calculateCost(tokensUsed: number): number {
  // Aproximacion: 50% input, 50% output
  const inputTokens = tokensUsed * 0.5;
  const outputTokens = tokensUsed * 0.5;

  const inputCost = (inputTokens / 1_000_000) * 0.15;
  const outputCost = (outputTokens / 1_000_000) * 0.6;

  return inputCost + outputCost;
}

// ============================================
// FUNCION PRINCIPAL
// ============================================

/**
 * Traduce contenido de seccion usando GPT-4o-mini
 *
 * @param content - Objeto JSON con el contenido a traducir
 * @param fromLang - Idioma origen (default: "es")
 * @param toLang - Idioma destino
 * @param existingContent - Contenido existente en target (para no sobrescribir)
 * @param options - Opciones de traduccion
 * @returns Contenido traducido + metadata
 *
 * @example
 * const result = await translateSectionContent(
 *   { h1: "Hola Mundo", button: "Confirmar" },
 *   "es",
 *   "en",
 *   null,
 *   { preserveExisting: true }
 * );
 * // Returns: { success: true, translatedContent: { h1: "Hello World", button: "Confirm" }, ... }
 */
export async function translateSectionContent(
  content: Record<string, unknown>,
  fromLang: string,
  toLang: string,
  existingContent?: Record<string, unknown> | null,
  options: TranslationOptions = {}
): Promise<TranslationResult> {
  const { preserveExisting = true } = options;
  const errors: string[] = [];
  let totalTokensUsed = 0;

  // Validar que tenemos API key
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      translatedContent: {},
      tokensUsed: 0,
      estimatedCost: 0,
      fieldsTranslated: 0,
      errors: ["OPENAI_API_KEY no configurada"],
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Flatten source content
  const flatSource = flattenObject(content);
  const sourceKeys = Object.entries(flatSource);

  if (sourceKeys.length === 0) {
    return {
      success: false,
      translatedContent: {},
      tokensUsed: 0,
      estimatedCost: 0,
      fieldsTranslated: 0,
      errors: ["El contenido source esta vacio"],
    };
  }

  // Si preserveExisting, filtrar keys que ya existen en target
  let keysToTranslate = sourceKeys;
  if (preserveExisting && existingContent) {
    const flatExisting = flattenObject(existingContent);
    keysToTranslate = sourceKeys.filter(([key]) => !(key in flatExisting));
  }

  if (keysToTranslate.length === 0) {
    return {
      success: true,
      translatedContent: existingContent || {},
      tokensUsed: 0,
      estimatedCost: 0,
      fieldsTranslated: 0,
      errors: [],
    };
  }

  // Nombres de idiomas para el prompt
  const fromLangName = LANGUAGE_NAMES[fromLang] || fromLang;
  const toLangName = LANGUAGE_NAMES[toLang] || toLang;

  // Dividir en chunks para evitar JSON truncado
  const chunks: [string, string | string[]][][] = [];
  for (let i = 0; i < keysToTranslate.length; i += CHUNK_SIZE) {
    chunks.push(keysToTranslate.slice(i, i + CHUNK_SIZE));
  }

  const allTranslations: Record<string, string | string[]> = {};

  console.log(
    `[translateContent] Traduciendo ${keysToTranslate.length} keys en ${chunks.length} chunks de ${fromLang} a ${toLang}`
  );

  for (let i = 0; i < chunks.length; i++) {
    const chunk = Object.fromEntries(chunks[i]);
    console.log(
      `[translateContent] Chunk ${i + 1}/${chunks.length} (${Object.keys(chunk).length} keys)...`
    );

    const prompt = `Translate these UI strings from ${fromLangName} to ${toLangName}.

RULES:
1. Keep the EXACT same keys (left side)
2. Translate ONLY the values (right side)
3. Preserve {{variables}} exactly as they are
4. Keep technical terms if needed (e.g., "JSON", "PDF", "QR")
5. Use natural, professional language for UI
6. For arrays, translate each element while preserving array structure
7. Return ONLY valid JSON, no explanations

INPUT (${fromLangName}):
${JSON.stringify(chunk, null, 2)}

OUTPUT (${toLangName}):`;

    try {
      const response = await openai.chat.completions.create({
        model: TRANSLATION_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a professional translator specializing in software UI localization. Return only valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
      });

      const responseContent = response.choices[0]?.message?.content || "{}";
      totalTokensUsed += response.usage?.total_tokens || 0;

      // Limpiar respuesta (a veces GPT agrega ```json)
      const cleanContent = responseContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      try {
        const chunkTranslations = JSON.parse(cleanContent);
        Object.assign(allTranslations, chunkTranslations);
      } catch (parseError) {
        console.error(
          `[translateContent] Error parseando chunk ${i + 1}:`,
          parseError
        );
        errors.push(`Error parseando chunk ${i + 1}: ${String(parseError)}`);
        // Continuar con siguiente chunk, no fallar todo
      }
    } catch (error) {
      console.error(`[translateContent] Error en chunk ${i + 1}:`, error);
      errors.push(`Error traduciendo chunk ${i + 1}: ${String(error)}`);
      // Continuar con siguiente chunk
    }
  }

  // Merge traducciones con contenido existente si preserveExisting
  let finalContent: Record<string, unknown>;

  if (preserveExisting && existingContent) {
    // Unflatten traducciones
    const translatedNested = unflattenObject(allTranslations);
    // Deep merge: existingContent tiene prioridad
    finalContent = deepMerge(translatedNested, existingContent);
  } else {
    finalContent = unflattenObject(allTranslations);
  }

  const fieldsTranslated = Object.keys(allTranslations).length;
  const estimatedCost = calculateCost(totalTokensUsed);

  console.log(
    `[translateContent] Completado: ${fieldsTranslated} fields, ${totalTokensUsed} tokens, $${estimatedCost.toFixed(6)}`
  );

  return {
    success: errors.length === 0 || fieldsTranslated > 0,
    translatedContent: finalContent,
    tokensUsed: totalTokensUsed,
    estimatedCost,
    fieldsTranslated,
    errors,
  };
}

/**
 * Deep merge dos objetos (source sobrescribe target excepto donde target tiene prioridad)
 */
function deepMerge(
  base: Record<string, unknown>,
  priority: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...base };

  for (const [key, value] of Object.entries(priority)) {
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      typeof result[key] === "object" &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(
        result[key] as Record<string, unknown>,
        value as Record<string, unknown>
      );
    } else {
      // priority tiene prioridad
      result[key] = value;
    }
  }

  return result;
}

/**
 * Detecta que campos faltan en el contenido target comparado con source
 */
export function detectMissingFields(
  sourceContent: Record<string, unknown>,
  targetContent: Record<string, unknown> | null
): string[] {
  if (!targetContent) {
    return Object.keys(flattenObject(sourceContent));
  }

  const flatSource = flattenObject(sourceContent);
  const flatTarget = flattenObject(targetContent);

  return Object.keys(flatSource).filter((key) => !(key in flatTarget));
}

/**
 * Calcula estadisticas de traduccion para una seccion
 */
export function getTranslationStats(
  sourceContent: Record<string, unknown>,
  targetContent: Record<string, unknown> | null
): {
  totalFields: number;
  translatedFields: number;
  missingFields: number;
  percentage: number;
} {
  const flatSource = flattenObject(sourceContent);
  const totalFields = Object.keys(flatSource).length;

  if (!targetContent) {
    return {
      totalFields,
      translatedFields: 0,
      missingFields: totalFields,
      percentage: 0,
    };
  }

  const flatTarget = flattenObject(targetContent);
  const translatedFields = Object.keys(flatTarget).filter(
    (key) => key in flatSource
  ).length;

  return {
    totalFields,
    translatedFields,
    missingFields: totalFields - translatedFields,
    percentage:
      totalFields > 0 ? Math.round((translatedFields / totalFields) * 100) : 0,
  };
}
