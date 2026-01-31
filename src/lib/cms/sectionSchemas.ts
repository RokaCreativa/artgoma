// 🧭 MIGA DE PAN: sectionSchemas.ts
// 📍 UBICACIÓN: src/lib/cms/sectionSchemas.ts
//
// 🎯 PORQUÉ EXISTE: Define la estructura de datos de cada sección editable del CMS
// 🎯 CASOS DE USO: Validación de formularios admin, tipado TypeScript, metadata de secciones
//
// 🔄 FLUJO: Admin edita sección → Valida con Zod → Guarda en SectionContent (JSON)
// 🔗 USADO EN: Admin content editor, queries/cms/getSectionContent.ts
// ⚠️ DEPENDENCIAS: zod
//
// 🚨 CUIDADO: Cambiar schemas puede romper validación de contenido existente en BD
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

import { z } from "zod";

// ============================================
// LOCALES DISPONIBLES
// ============================================

export const AVAILABLE_LOCALES = ["es", "en", "de", "fr", "it", "ru"] as const;
export type Locale = (typeof AVAILABLE_LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  es: "Español",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  ru: "Русский",
};

// ============================================
// SCHEMA: HOME (Hero)
// ============================================

export const HomeSchema = z.object({
  h1: z.string().min(1, "El título es requerido"),
  button: z.string().min(1, "El texto del botón es requerido"),
});

export type HomeContent = z.infer<typeof HomeSchema>;

// ============================================
// SCHEMA: ENJOY
// ============================================

export const EnjoySchema = z.object({
  h1: z.object({
    span1: z.string().min(1, "span1 es requerido"),
    span2: z.string().min(1, "span2 es requerido"),
    span3: z.string().optional().default(""),
  }),
});

export type EnjoyContent = z.infer<typeof EnjoySchema>;

// ============================================
// SCHEMA: CONNECT
// ============================================

export const ConnectSchema = z.object({
  h1: z.object({
    span1: z.string().min(1, "span1 es requerido"),
    span2: z.string().min(1, "span2 es requerido"),
  }),
});

export type ConnectContent = z.infer<typeof ConnectSchema>;

// ============================================
// SCHEMA: INSPIRE
// ============================================

export const InspireSchema = z.object({
  h1: z.object({
    span1: z.string().min(1, "span1 es requerido"),
    span2: z.string().min(1, "span2 es requerido"),
  }),
  text: z.object({
    p1: z.string().min(1, "Párrafo 1 es requerido"),
    p2: z.string().min(1, "Párrafo 2 es requerido"),
    p3: z.string().min(1, "Párrafo 3 es requerido"),
    p4: z.string().min(1, "Párrafo 4 es requerido"),
  }),
  caption: z.object({
    span1: z.string().min(1, "span1 del caption es requerido"),
    normalText: z.string().min(1, "Texto normal es requerido"),
    span2: z.string().min(1, "span2 del caption es requerido"),
    span3: z.string().optional().default("!"),
  }),
});

export type InspireContent = z.infer<typeof InspireSchema>;

// ============================================
// SCHEMA: CONTACT (Location section)
// ============================================

export const ContactSchema = z.object({
  h1: z.object({
    span1: z.string().min(1, "span1 es requerido"),
    span2: z.string().min(1, "span2 es requerido"),
  }),
});

export type ContactContent = z.infer<typeof ContactSchema>;

// ============================================
// SCHEMA: GET IN TOUCH
// ============================================

export const GetInTouchSchema = z.object({
  h1: z.object({
    span1: z.string().min(1, "span1 es requerido"),
    span2: z.string().min(1, "span2 es requerido"),
  }),
  contact: z.string().min(1, "Texto de contacto es requerido"),
});

export type GetInTouchContent = z.infer<typeof GetInTouchSchema>;

// ============================================
// SCHEMA: WELCOME PAGE
// ============================================

export const WelcomePageSchema = z.object({
  h1: z.string().min(1, "h1 es requerido"),
  h2: z.string().min(1, "h2 es requerido"),
  h3: z.string().min(1, "h3 es requerido"),
  description: z.object({
    p1: z.string().min(1, "Descripción p1 es requerida"),
    p2: z.string().min(1, "Descripción p2 es requerida"),
  }),
  buttons: z.object({
    confirm: z.string().min(1, "Texto botón confirmar es requerido"),
    more: z.string().min(1, "Texto botón más info es requerido"),
  }),
});

export type WelcomePageContent = z.infer<typeof WelcomePageSchema>;

// ============================================
// SCHEMA: NAVBAR
// ============================================

export const NavbarSchema = z.object({
  nav: z.array(z.string()).min(5, "Se requieren 5 elementos de navegación"),
});

export type NavbarContent = z.infer<typeof NavbarSchema>;

// ============================================
// SCHEMA: DROPDOWN (Language selector)
// ============================================

export const DropdownSchema = z.object({
  title: z.string().min(1, "Título es requerido"),
  languages: z.array(z.string()).min(1, "Se requiere al menos un idioma"),
});

export type DropdownContent = z.infer<typeof DropdownSchema>;

// ============================================
// SCHEMA: FORM
// ============================================

export const FormSchema = z.object({
  linkBack: z.string().min(1, "Texto volver es requerido"),
  title: z.string().min(1, "Título del formulario es requerido"),
  labels: z.object({
    name: z.string().min(1, "Label nombre es requerido"),
    email: z.string().min(1, "Label email es requerido"),
    phone: z.string().min(1, "Label teléfono es requerido"),
    day: z.string().min(1, "Label día es requerido"),
    time: z.string().min(1, "Label hora es requerido"),
    company: z.string().min(1, "Label empresa es requerido"),
  }),
  placeHolder: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    day: z.string(),
    time: z.string(),
    company: z.string(),
  }),
  buttons: z.object({
    addCompanion: z.string().min(1, "Texto añadir acompañante es requerido"),
    confirm: z.string().min(1, "Texto confirmar es requerido"),
  }),
});

export type FormContent = z.infer<typeof FormSchema>;

// ============================================
// SCHEMA: UI (Textos de interfaz general)
// ============================================

export const UISchema = z.object({
  toasts: z.object({
    successTitle: z.string().min(1, "Titulo exito requerido"),
    successConfirmation: z.string().min(1, "Mensaje confirmacion requerido"),
    errorTitle: z.string().min(1, "Titulo error requerido"),
    errorMessage: z.string().min(1, "Mensaje error requerido"),
  }),
  dialog: z.object({
    confirmTitle: z.string().min(1, "Titulo confirmar requerido"),
    withAuth: z.string().min(1, "Texto con auth requerido"),
    withoutAuth: z.string().min(1, "Texto sin auth requerido"),
    withoutAuthTitle: z.string().min(1, "Titulo sin auth requerido"),
    or: z.string().min(1, "Texto 'o' requerido"),
  }),
  auth: z.object({
    login: z.string().min(1, "Texto login requerido"),
    logout: z.string().min(1, "Texto logout requerido"),
    visits: z.string().min(1, "Texto visitas requerido"),
    events: z.string().min(1, "Texto eventos requerido"),
    eventsPanel: z.string().min(1, "Texto panel eventos requerido"),
    qrGenerator: z.string().min(1, "Texto generador QR requerido"),
  }),
  accessibility: z.object({
    sendEmail: z.string().min(1, "Aria-label email requerido"),
    facebook: z.string().min(1, "Aria-label Facebook requerido"),
    instagram: z.string().min(1, "Aria-label Instagram requerido"),
    youtube: z.string().min(1, "Aria-label YouTube requerido"),
    twitter: z.string().min(1, "Aria-label Twitter requerido"),
    play: z.string().min(1, "Aria-label play requerido"),
    pause: z.string().min(1, "Aria-label pause requerido"),
  }),
});

export type UIContent = z.infer<typeof UISchema>;

// ============================================
// SECCIONES DISPONIBLES
// ============================================

export const AVAILABLE_SECTIONS = [
  "home",
  "enjoy",
  "connect",
  "inspire",
  "contact",
  "getInTouch",
  "welcomePage",
  "navbar",
  "dropdown",
  "form",
  "ui",
] as const;

export type SectionKey = (typeof AVAILABLE_SECTIONS)[number];

// ============================================
// MAPEO DE SCHEMAS POR SECCIÓN
// ============================================

export const SECTION_SCHEMAS = {
  home: {
    key: "home" as const,
    label: "Hero (Inicio)",
    description: "Título principal y botón de la página de inicio",
    schema: HomeSchema,
    fields: [
      {
        name: "h1",
        type: "text" as const,
        label: "Título Principal (H1)",
        placeholder: "EXPERIENCIA ÚNICA",
      },
      {
        name: "button",
        type: "text" as const,
        label: "Texto del Botón",
        placeholder: "Confirmar",
      },
    ],
  },
  enjoy: {
    key: "enjoy" as const,
    label: "Disfruta en Vivo",
    description: "Título de la sección de arte en vivo",
    schema: EnjoySchema,
    fields: [
      {
        name: "h1.span1",
        type: "text" as const,
        label: "Título Parte 1",
        placeholder: "ARTE",
      },
      {
        name: "h1.span2",
        type: "text" as const,
        label: "Título Parte 2",
        placeholder: "EN VIVO",
      },
      {
        name: "h1.span3",
        type: "text" as const,
        label: "Título Parte 3 (opcional)",
        placeholder: "",
      },
    ],
  },
  connect: {
    key: "connect" as const,
    label: "Conectar",
    description: "Título de la sección de conexión con Tenerife",
    schema: ConnectSchema,
    fields: [
      {
        name: "h1.span1",
        type: "text" as const,
        label: "Título Parte 1",
        placeholder: "CONECTE",
      },
      {
        name: "h1.span2",
        type: "text" as const,
        label: "Título Parte 2",
        placeholder: "CON TENERIFE",
      },
    ],
  },
  inspire: {
    key: "inspire" as const,
    label: "Inspírate",
    description: "Sección de inspiración con título, 4 párrafos y caption",
    schema: InspireSchema,
    fields: [
      {
        name: "h1.span1",
        type: "text" as const,
        label: "Título Parte 1",
        placeholder: "INSPÍRATE",
      },
      {
        name: "h1.span2",
        type: "text" as const,
        label: "Título Parte 2",
        placeholder: "EN GoMA",
      },
      {
        name: "text.p1",
        type: "textarea" as const,
        label: "Párrafo 1",
        placeholder: "Explora el fascinante mundo...",
      },
      {
        name: "text.p2",
        type: "textarea" as const,
        label: "Párrafo 2",
        placeholder: "Tu viaje en GoMA...",
      },
      {
        name: "text.p3",
        type: "textarea" as const,
        label: "Párrafo 3",
        placeholder: "El propósito es AYUDAR...",
      },
      {
        name: "text.p4",
        type: "textarea" as const,
        label: "Párrafo 4",
        placeholder: "Cada contribución...",
      },
      {
        name: "caption.span1",
        type: "text" as const,
        label: "Caption - Inicio",
        placeholder: "Únete a nosotros",
      },
      {
        name: "caption.normalText",
        type: "text" as const,
        label: "Caption - Texto",
        placeholder: "y deja tu contribución a la isla apoyando",
      },
      {
        name: "caption.span2",
        type: "text" as const,
        label: "Caption - Destacado",
        placeholder: "al talento local",
      },
      {
        name: "caption.span3",
        type: "text" as const,
        label: "Caption - Final",
        placeholder: "!",
      },
    ],
  },
  contact: {
    key: "contact" as const,
    label: "Ubicación",
    description: "Título de la sección de ubicación/mapa",
    schema: ContactSchema,
    fields: [
      {
        name: "h1.span1",
        type: "text" as const,
        label: "Título Parte 1",
        placeholder: "ESTAMOS MUY",
      },
      {
        name: "h1.span2",
        type: "text" as const,
        label: "Título Parte 2",
        placeholder: "CERCA",
      },
    ],
  },
  getInTouch: {
    key: "getInTouch" as const,
    label: "Contacto",
    description: "Sección de contacto con formulario",
    schema: GetInTouchSchema,
    fields: [
      {
        name: "h1.span1",
        type: "text" as const,
        label: "Título Parte 1",
        placeholder: "CONTACTE",
      },
      {
        name: "h1.span2",
        type: "text" as const,
        label: "Título Parte 2",
        placeholder: "CON NOSOTROS",
      },
      {
        name: "contact",
        type: "text" as const,
        label: "Texto Botón Contacto",
        placeholder: "CONTÁCTENOS",
      },
    ],
  },
  welcomePage: {
    key: "welcomePage" as const,
    label: "Página VIP",
    description: "Página de bienvenida VIP con títulos, descripción y botones",
    schema: WelcomePageSchema,
    fields: [
      {
        name: "h1",
        type: "text" as const,
        label: "Título Principal (H1)",
        placeholder: "ENTRADA VIP",
      },
      {
        name: "h2",
        type: "text" as const,
        label: "Subtítulo (H2)",
        placeholder: "ACCESO GRATUITO",
      },
      {
        name: "h3",
        type: "text" as const,
        label: "Subtítulo (H3)",
        placeholder: "DISFRUTA EL ARTE EN VIVO",
      },
      {
        name: "description.p1",
        type: "textarea" as const,
        label: "Descripción Párrafo 1",
        placeholder: "La ENTRADA de cortesía VIP significa...",
      },
      {
        name: "description.p2",
        type: "textarea" as const,
        label: "Descripción Párrafo 2",
        placeholder: "Disfruta de un recorrido guiado...",
      },
      {
        name: "buttons.confirm",
        type: "text" as const,
        label: "Botón Confirmar",
        placeholder: "Confirmar",
      },
      {
        name: "buttons.more",
        type: "text" as const,
        label: "Botón Más Info",
        placeholder: "Más sobre nosotros",
      },
    ],
  },
  navbar: {
    key: "navbar" as const,
    label: "Navegación",
    description: "Elementos del menú de navegación",
    schema: NavbarSchema,
    fields: [
      {
        name: "nav",
        type: "array" as const,
        label: "Elementos de Navegación",
        placeholder: "DISFRUTA EN VIVO, CONECTAR, HISTORIAS...",
      },
    ],
  },
  dropdown: {
    key: "dropdown" as const,
    label: "Selector de Idiomas",
    description: "Título y lista de idiomas del dropdown",
    schema: DropdownSchema,
    fields: [
      {
        name: "title",
        type: "text" as const,
        label: "Título",
        placeholder: "Idiomas",
      },
      {
        name: "languages",
        type: "array" as const,
        label: "Nombres de Idiomas",
        placeholder: "Inglés, Español, Francés...",
      },
    ],
  },
  form: {
    key: "form" as const,
    label: "Formulario de Reserva",
    description: "Labels, placeholders y botones del formulario",
    schema: FormSchema,
    fields: [
      {
        name: "linkBack",
        type: "text" as const,
        label: "Texto Volver",
        placeholder: "Volver",
      },
      {
        name: "title",
        type: "text" as const,
        label: "Título del Formulario",
        placeholder: "Reservar Golden Ticket",
      },
      {
        name: "labels.name",
        type: "text" as const,
        label: "Label: Nombre",
        placeholder: "Nombre completo",
      },
      {
        name: "labels.email",
        type: "text" as const,
        label: "Label: Email",
        placeholder: "correo electrónico",
      },
      {
        name: "labels.phone",
        type: "text" as const,
        label: "Label: Teléfono",
        placeholder: "teléfono",
      },
      {
        name: "labels.day",
        type: "text" as const,
        label: "Label: Día",
        placeholder: "¿Qué día prefieres?",
      },
      {
        name: "labels.time",
        type: "text" as const,
        label: "Label: Hora",
        placeholder: "¿Qué hora prefieres?",
      },
      {
        name: "labels.company",
        type: "text" as const,
        label: "Label: Empresa",
        placeholder: "empresa (opcional)",
      },
      {
        name: "placeHolder.name",
        type: "text" as const,
        label: "Placeholder: Nombre",
        placeholder: "Nombre completo",
      },
      {
        name: "placeHolder.email",
        type: "text" as const,
        label: "Placeholder: Email",
        placeholder: "correo electrónico",
      },
      {
        name: "placeHolder.phone",
        type: "text" as const,
        label: "Placeholder: Teléfono",
        placeholder: "teléfono",
      },
      {
        name: "placeHolder.day",
        type: "text" as const,
        label: "Placeholder: Día",
        placeholder: "",
      },
      {
        name: "placeHolder.time",
        type: "text" as const,
        label: "Placeholder: Hora",
        placeholder: "hora",
      },
      {
        name: "placeHolder.company",
        type: "text" as const,
        label: "Placeholder: Empresa",
        placeholder: "empresa (opcional)",
      },
      {
        name: "buttons.addCompanion",
        type: "text" as const,
        label: "Botón: Añadir Acompañante",
        placeholder: "Añadir acompañante/s",
      },
      {
        name: "buttons.confirm",
        type: "text" as const,
        label: "Botón: Confirmar",
        placeholder: "Confirmar",
      },
    ],
  },
  ui: {
    key: "ui" as const,
    label: "Interfaz de Usuario",
    description: "Textos generales de la interfaz: toasts, dialogos, auth, accesibilidad",
    schema: UISchema,
    fields: [
      {
        name: "toasts.successTitle",
        type: "text" as const,
        label: "Toast: Titulo Exito",
        placeholder: "Exitoso",
      },
      {
        name: "toasts.successConfirmation",
        type: "text" as const,
        label: "Toast: Mensaje Confirmacion",
        placeholder: "Confirmacion enviada correctamente!",
      },
      {
        name: "toasts.errorTitle",
        type: "text" as const,
        label: "Toast: Titulo Error",
        placeholder: "Error",
      },
      {
        name: "toasts.errorMessage",
        type: "text" as const,
        label: "Toast: Mensaje Error",
        placeholder: "Ha ocurrido un error",
      },
      {
        name: "dialog.confirmTitle",
        type: "text" as const,
        label: "Dialog: Titulo Confirmar",
        placeholder: "Como desea confirmar?",
      },
      {
        name: "dialog.withAuth",
        type: "text" as const,
        label: "Dialog: Con Autenticacion",
        placeholder: "Con Autenticacion",
      },
      {
        name: "dialog.withoutAuth",
        type: "text" as const,
        label: "Dialog: Sin Autenticacion",
        placeholder: "Sin Autenticacion",
      },
      {
        name: "dialog.withoutAuthTitle",
        type: "text" as const,
        label: "Dialog: Titulo Sin Auth",
        placeholder: "Confirmar sin autenticacion?",
      },
      {
        name: "dialog.or",
        type: "text" as const,
        label: "Dialog: Texto 'o'",
        placeholder: "o",
      },
      {
        name: "auth.login",
        type: "text" as const,
        label: "Auth: Login",
        placeholder: "Iniciar Sesion",
      },
      {
        name: "auth.logout",
        type: "text" as const,
        label: "Auth: Logout",
        placeholder: "Cerrar Sesion",
      },
      {
        name: "auth.visits",
        type: "text" as const,
        label: "Auth: Visitas",
        placeholder: "Visitas",
      },
      {
        name: "auth.events",
        type: "text" as const,
        label: "Auth: Eventos",
        placeholder: "Eventos",
      },
      {
        name: "auth.eventsPanel",
        type: "text" as const,
        label: "Auth: Panel Eventos",
        placeholder: "Panel de Eventos",
      },
      {
        name: "auth.qrGenerator",
        type: "text" as const,
        label: "Auth: Generador QR",
        placeholder: "Generador QR",
      },
      {
        name: "accessibility.sendEmail",
        type: "text" as const,
        label: "Accesibilidad: Enviar Email",
        placeholder: "Enviar email",
      },
      {
        name: "accessibility.facebook",
        type: "text" as const,
        label: "Accesibilidad: Facebook",
        placeholder: "Facebook",
      },
      {
        name: "accessibility.instagram",
        type: "text" as const,
        label: "Accesibilidad: Instagram",
        placeholder: "Instagram",
      },
      {
        name: "accessibility.youtube",
        type: "text" as const,
        label: "Accesibilidad: YouTube",
        placeholder: "YouTube",
      },
      {
        name: "accessibility.twitter",
        type: "text" as const,
        label: "Accesibilidad: Twitter",
        placeholder: "Twitter",
      },
      {
        name: "accessibility.play",
        type: "text" as const,
        label: "Accesibilidad: Reproducir",
        placeholder: "Reproducir",
      },
      {
        name: "accessibility.pause",
        type: "text" as const,
        label: "Accesibilidad: Pausar",
        placeholder: "Pausar",
      },
    ],
  },
} as const;

// ============================================
// TIPOS DERIVADOS
// ============================================

export type SectionSchema = typeof SECTION_SCHEMAS;
export type SectionConfig = SectionSchema[SectionKey];

// Tipo union de todo el contenido posible
export type SectionContentData =
  | HomeContent
  | EnjoyContent
  | ConnectContent
  | InspireContent
  | ContactContent
  | GetInTouchContent
  | WelcomePageContent
  | NavbarContent
  | DropdownContent
  | FormContent
  | UIContent;

// Mapeo de sección a su tipo de contenido
export type SectionContentMap = {
  home: HomeContent;
  enjoy: EnjoyContent;
  connect: ConnectContent;
  inspire: InspireContent;
  contact: ContactContent;
  getInTouch: GetInTouchContent;
  welcomePage: WelcomePageContent;
  navbar: NavbarContent;
  dropdown: DropdownContent;
  form: FormContent;
  ui: UIContent;
};

// ============================================
// HELPERS DE VALIDACIÓN
// ============================================

/**
 * Valida el contenido de una sección contra su schema
 */
export function validateSectionContent<K extends SectionKey>(
  sectionKey: K,
  content: unknown,
):
  | { success: true; data: SectionContentMap[K] }
  | { success: false; error: z.ZodError } {
  const schema = SECTION_SCHEMAS[sectionKey]?.schema;
  if (!schema) {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: "custom",
          message: `Schema no encontrado para sección: ${sectionKey}`,
          path: [],
        },
      ]),
    };
  }

  const result = schema.safeParse(content);
  if (result.success) {
    return { success: true, data: result.data as SectionContentMap[K] };
  }
  return { success: false, error: result.error };
}

/**
 * Obtiene el schema de una sección
 */
export function getSectionSchema(sectionKey: SectionKey): z.ZodSchema | null {
  return SECTION_SCHEMAS[sectionKey]?.schema ?? null;
}

/**
 * Obtiene la configuración completa de una sección
 */
export function getSectionConfig(sectionKey: SectionKey): SectionConfig | null {
  return SECTION_SCHEMAS[sectionKey] ?? null;
}

/**
 * Obtiene los campos de una sección para renderizar formularios
 */
export function getSectionFields(sectionKey: SectionKey) {
  return SECTION_SCHEMAS[sectionKey]?.fields ?? [];
}

/**
 * Verifica si una key es una sección válida
 */
export function isValidSectionKey(key: string): key is SectionKey {
  return AVAILABLE_SECTIONS.includes(key as SectionKey);
}

/**
 * Verifica si un locale es válido
 */
export function isValidLocale(locale: string): locale is Locale {
  return AVAILABLE_LOCALES.includes(locale as Locale);
}

// ============================================
// HELPER PARA ACCEDER A VALORES ANIDADOS
// ============================================

/**
 * Obtiene un valor de un objeto usando notación de punto (e.g., "h1.span1")
 */
export function getNestedValue(
  obj: Record<string, unknown>,
  path: string,
): unknown {
  return path.split(".").reduce((current: unknown, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Establece un valor en un objeto usando notación de punto (e.g., "h1.span1")
 */
export function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const keys = path.split(".");
  const lastKey = keys.pop();
  if (!lastKey) return;

  const target = keys.reduce((current: unknown, key) => {
    if (current && typeof current === "object") {
      if (!(key in current)) {
        (current as Record<string, unknown>)[key] = {};
      }
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);

  if (target && typeof target === "object") {
    (target as Record<string, unknown>)[lastKey] = value;
  }
}

// ============================================
// SECCIONES PRINCIPALES PARA EL EDITOR (sin form/navbar/dropdown)
// ============================================

export const EDITABLE_SECTIONS = [
  "home",
  "enjoy",
  "connect",
  "inspire",
  "contact",
  "getInTouch",
  "welcomePage",
] as const;

export type EditableSectionKey = (typeof EDITABLE_SECTIONS)[number];

/**
 * Obtiene solo las secciones principales editables en el admin
 * NOTA: Incluye schemas de Zod - NO pasar a Client Components
 */
export function getEditableSections() {
  return EDITABLE_SECTIONS.map((key) => SECTION_SCHEMAS[key]);
}

/**
 * Versión serializable de getEditableSections para pasar a Client Components
 * Excluye schemas de Zod que no son serializables
 */
export function getEditableSectionsSerializable() {
  return EDITABLE_SECTIONS.map((key) => {
    const section = SECTION_SCHEMAS[key];
    // Omitir schema de Zod - no serializable
    return {
      key: section.key,
      label: section.label,
      description: section.description,
      fields: section.fields,
    };
  });
}
