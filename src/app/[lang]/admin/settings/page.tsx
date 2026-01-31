// 🧭 MIGA DE PAN: Settings Page - Configuracion del Sitio
// 📍 UBICACION: src/app/[lang]/admin/settings/page.tsx
//
// 🎯 PORQUE EXISTE: Gestionar configuracion del sitio (contacto, redes, footer)
// 🎯 CASOS DE USO: Admin edita telefono, email, redes sociales, copyright
//
// 🔄 FLUJO: Load configs → Display groups → User edits → Save per field
// 🔗 USADO EN: Admin panel sidebar "Configuracion"
// ⚠️ DEPENDENCIAS: @/actions/cms/config, ConfigGroup component
//
// 🚨 CUIDADO: Crear configs si no existen (seed automatico)
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 3.2)

import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getAllConfigsGrouped, seedDefaultConfigs } from "@/actions/cms/config";
import {
  PREDEFINED_CONFIGS,
  ConfigGroup as ConfigGroupType,
  FONT_OPTIONS,
} from "@/lib/cms/configConstants";
import { Locale } from "@/configs/i18n.config";
import { Settings } from "lucide-react";
import ConfigGroup from "./components/ConfigGroup";

interface SettingsPageProps {
  params: Promise<{ lang: Locale }>;
}

// Definicion de grupos con sus configs
// FIX Next.js 16: Usar iconName string en vez de JSX para serialización Server->Client
const CONFIG_GROUPS_DEFINITION: Array<{
  key: ConfigGroupType;
  title: string;
  iconName: string; // Cambiado de icon: React.ReactNode
  configs: Array<{
    key: string;
    label: string;
    type: "text" | "url" | "email" | "phone" | "color" | "select";
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
  }>;
}> = [
  {
    key: "appearance",
    title: "Apariencia",
    iconName: "palette",
    configs: [
      {
        key: "bg_primary",
        label: "Color de Fondo Principal",
        type: "color",
        placeholder: "#1c1f24",
      },
      {
        key: "bg_surface",
        label: "Color de Superficies",
        type: "color",
        placeholder: "#2a2d35",
      },
      {
        key: "bg_input",
        label: "Color de Inputs",
        type: "color",
        placeholder: "#0f1115",
      },
      {
        key: "accent_color",
        label: "Color de Acento",
        type: "color",
        placeholder: "#dc2626",
      },
      {
        key: "bg_footer",
        label: "Color del Footer",
        type: "color",
        placeholder: "#000000",
      },
      {
        key: "font_display",
        label: "Fuente de Titulos (Display)",
        type: "select",
        options: [...FONT_OPTIONS.display],
      },
      {
        key: "font_body",
        label: "Fuente de Textos (Body)",
        type: "select",
        options: [...FONT_OPTIONS.body],
      },
      {
        key: "connect_image",
        label: "Imagen Sección Conecte (banana)",
        type: "url",
        placeholder: "/banana.avif",
      },
      {
        key: "connect_pattern",
        label: "Pattern Fondo Conecte",
        type: "url",
        placeholder: "/paterngoma.png",
      },
      {
        key: "logo_url",
        label: "Logo del Sitio (navbar)",
        type: "url",
        placeholder: "/logo-artgoma.svg",
      },
      {
        key: "favicon_url",
        label: "Favicon",
        type: "url",
        placeholder: "/favicon.ico",
      },
      {
        key: "site_title",
        label: "Título del Sitio (meta)",
        type: "text",
        placeholder: "ArtGoMa",
      },
      {
        key: "site_description",
        label: "Descripción del Sitio (meta)",
        type: "text",
        placeholder: "Welcome to GoMa gallery!",
      },
      {
        key: "og_image",
        label: "Imagen OpenGraph (compartir)",
        type: "url",
        placeholder: "/bg-black-logo-goma.png",
      },
      {
        key: "apple_touch_icon",
        label: "Apple Touch Icon",
        type: "url",
        placeholder: "/apple-touch-icon.png",
      },
      {
        key: "explore_image",
        label: "Imagen 'Explore' (sección contacto)",
        type: "url",
        placeholder: "/explore.svg",
      },
      {
        key: "rotate_axis_icon",
        label: "Icono 360° (hero)",
        type: "url",
        placeholder: "/rotate-axis.svg",
      },
      {
        key: "logo_horizontal",
        label: "Logo Horizontal (GetInTouch)",
        type: "url",
        placeholder: "/Logo Goma horizontal.svg",
      },
      {
        key: "logo_vertical",
        label: "Logo Vertical (GetInspired)",
        type: "url",
        placeholder: "/LogoGomaVertical.svg",
      },
    ],
  },
  {
    key: "contact",
    title: "Contacto",
    iconName: "phone",
    configs: [
      {
        key: "phone",
        label: "Telefono",
        type: "phone",
        placeholder: "+34 123 456 789",
      },
      {
        key: "email",
        label: "Email",
        type: "email",
        placeholder: "info@artgoma.com",
      },
      {
        key: "address",
        label: "Direccion",
        type: "text",
        placeholder: "Calle Example 123, Ciudad",
      },
      {
        key: "whatsapp",
        label: "WhatsApp",
        type: "phone",
        placeholder: "+34 123 456 789",
      },
      {
        key: "maps_link",
        label: "Link Google Maps",
        type: "url",
        placeholder: "https://maps.app.goo.gl/...",
      },
    ],
  },
  {
    key: "social",
    title: "Redes Sociales",
    iconName: "share2",
    configs: [
      {
        key: "facebook",
        label: "Facebook",
        type: "url",
        placeholder: "https://facebook.com/artgoma",
      },
      {
        key: "instagram",
        label: "Instagram",
        type: "url",
        placeholder: "https://instagram.com/artgoma",
      },
      {
        key: "youtube",
        label: "YouTube",
        type: "url",
        placeholder: "https://youtube.com/@artgoma",
      },
      {
        key: "twitter",
        label: "Twitter/X",
        type: "url",
        placeholder: "https://twitter.com/artgoma",
      },
    ],
  },
  {
    key: "footer",
    title: "Footer",
    iconName: "fileText",
    configs: [
      {
        key: "copyright",
        label: "Texto Copyright",
        type: "text",
        placeholder: "© 2023 GOMA ALL RIGHTS RESERVED",
      },
      {
        key: "website",
        label: "URL del Sitio",
        type: "text",
        placeholder: "WWW.ARTGOMA.COM",
      },
      { key: "year", label: "Ano", type: "text", placeholder: "2026" },
    ],
  },
];

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { lang } = await params;

  // Verificar autenticacion
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect(`/${lang}/admin/login`);
  }

  // Seed configs si no existen
  await seedDefaultConfigs();

  // Obtener todas las configuraciones agrupadas
  const configsResult = await getAllConfigsGrouped();
  const configsGrouped = configsResult.data || {};

  // Preparar datos para cada grupo
  const groupsWithValues = CONFIG_GROUPS_DEFINITION.map((group) => {
    const groupConfigs = configsGrouped[group.key] || [];

    // Mapear configs con sus valores actuales
    const configsWithValues = group.configs.map((configDef) => {
      const existingConfig = groupConfigs.find((c) => c.key === configDef.key);
      return {
        ...configDef,
        value: existingConfig?.value || "",
      };
    });

    return {
      ...group,
      configs: configsWithValues,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Configuracion</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestiona la informacion de contacto, redes sociales y footer
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Cambios se guardan individualmente</span>
        </div>
      </div>

      {/* Config groups */}
      <div className="space-y-4">
        {groupsWithValues.map((group) => (
          <ConfigGroup
            key={group.key}
            title={group.title}
            iconName={group.iconName}
            configs={group.configs}
            groupKey={group.key}
          />
        ))}
      </div>

      {/* Info card */}
      <div className="bg-[#1c1f24] border border-gray-800 rounded-xl p-4 mt-8">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Settings className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">
              Sobre esta configuracion
            </h3>
            <p className="text-gray-400 text-sm">
              Los cambios en esta seccion afectan a toda la web. El telefono,
              email y redes sociales aparecen en el footer y la seccion de
              contacto. Los cambios se aplican inmediatamente despues de guardar
              cada campo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
