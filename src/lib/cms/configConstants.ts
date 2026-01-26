// 🧭 MIGA DE PAN: Constantes del CMS Config
// 📍 UBICACIÓN: src/lib/cms/configConstants.ts
// 🎯 PORQUÉ EXISTE: Separar constantes de server actions (Next.js 16 requirement)
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

/**
 * Grupos de configuración predefinidos
 */
export const CONFIG_GROUPS = {
  contact: "contact", // phone, email, address, whatsapp
  social: "social", // facebook, instagram, youtube, twitter, linkedin, tiktok
  footer: "footer", // copyright, year
  meta: "meta", // siteName, siteUrl, description
  general: "general", // otros
} as const;

/**
 * Tipos de valores permitidos
 */
export const CONFIG_TYPES = {
  text: "text",
  url: "url",
  email: "email",
  phone: "phone",
  image: "image",
} as const;

/**
 * Keys predefinidas por grupo (para referencia y validación)
 */
export const PREDEFINED_KEYS = {
  contact: ["phone", "email", "address", "whatsapp", "maps_link"],
  social: ["facebook", "instagram", "youtube", "twitter", "linkedin", "tiktok"],
  footer: ["copyright", "year", "website", "company_name"],
  meta: ["site_title", "site_description", "og_image", "site_url"],
} as const;

/**
 * Configuraciones predefinidas con valores por defecto (para seed inicial)
 * Estos son los valores actuales hardcodeados en el frontend
 */
export const PREDEFINED_CONFIGS: Array<{
  key: string;
  value: string;
  type: string;
  group: string;
  label: string;
}> = [
  // Contacto
  {
    key: "phone",
    value: "+34 605 620 857",
    type: "phone",
    group: "contact",
    label: "Telefono",
  },
  {
    key: "email",
    value: "info@artgoma.com",
    type: "email",
    group: "contact",
    label: "Email",
  },
  {
    key: "address",
    value: "Av. Ayyo Nr. 73, Local 7, 38670 Adeje",
    type: "text",
    group: "contact",
    label: "Direccion",
  },
  {
    key: "whatsapp",
    value: "+34 605 620 857",
    type: "phone",
    group: "contact",
    label: "WhatsApp",
  },
  {
    key: "maps_link",
    value: "https://maps.app.goo.gl/gj1YJZ8sSVYZ6zQg6",
    type: "url",
    group: "contact",
    label: "Link Google Maps",
  },
  // Redes sociales
  {
    key: "facebook",
    value: "https://www.facebook.com/theartgomagallery",
    type: "url",
    group: "social",
    label: "Facebook",
  },
  {
    key: "instagram",
    value: "https://www.instagram.com/theartgomagallery",
    type: "url",
    group: "social",
    label: "Instagram",
  },
  {
    key: "youtube",
    value: "https://www.youtube.com/@ArtGoMA",
    type: "url",
    group: "social",
    label: "YouTube",
  },
  {
    key: "twitter",
    value: "",
    type: "url",
    group: "social",
    label: "Twitter/X",
  },
  // Footer
  {
    key: "copyright",
    value: "© 2023 GOMA ALL RIGHTS RESERVED",
    type: "text",
    group: "footer",
    label: "Texto Copyright",
  },
  {
    key: "website",
    value: "WWW.ARTGOMA.COM",
    type: "text",
    group: "footer",
    label: "URL del Sitio",
  },
  { key: "year", value: "2023", type: "text", group: "footer", label: "Ano" },
];

// Tipos derivados
export type ConfigGroup = keyof typeof CONFIG_GROUPS;
export type ConfigType = keyof typeof CONFIG_TYPES;

export interface ISiteConfig {
  id: number;
  key: string;
  value: string;
  type: string;
  group: string;
  label: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ConfigMap = Record<string, string>;
