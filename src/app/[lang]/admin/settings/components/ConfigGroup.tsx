// 🧭 MIGA DE PAN: ConfigGroup Component - Grupo de configuraciones colapsable
// 📍 UBICACION: src/app/[lang]/admin/settings/components/ConfigGroup.tsx
//
// 🎯 PORQUE EXISTE: Mostrar y editar configuraciones agrupadas (Contacto, Redes, Footer)
// 🎯 CASOS DE USO: Settings page del admin panel
//
// 🔄 FLUJO: Render configs → User edits → Save → Revalidate
// 🔗 USADO EN: /admin/settings/page.tsx
// ⚠️ DEPENDENCIAS: @/actions/cms/config
//
// 🚨 CUIDADO: Validacion de tipos (email, phone, url) antes de guardar
// 🚨 FIX 26-01-2026: iconName string instead of React.ReactNode to fix Next.js 16 Server->Client serialization
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 3.2)

"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Phone,
  Share2,
  FileText,
  LucideIcon,
} from "lucide-react";
import { upsertConfig } from "@/actions/cms/config";
import {
  ISiteConfig,
  PREDEFINED_CONFIGS,
  ConfigType,
  ConfigGroup as ConfigGroupType,
} from "@/lib/cms/configConstants";
import { cn } from "@/lib/utils";

// Mapa de iconos - resuelve el problema de serialización Server->Client en Next.js 16
const iconMap: Record<string, LucideIcon> = {
  phone: Phone,
  share2: Share2,
  fileText: FileText,
};

interface ConfigGroupProps {
  title: string;
  iconName: string; // Cambiado de icon: React.ReactNode
  configs: ConfigItem[];
  groupKey: ConfigGroupType;
}

interface ConfigItem {
  key: string;
  label: string;
  type: "text" | "url" | "email" | "phone";
  value: string;
  placeholder?: string;
}

interface SaveState {
  [key: string]: "idle" | "saving" | "saved" | "error";
}

// Validaciones por tipo
const validateByType = (
  value: string,
  type: string,
): { valid: boolean; error?: string } => {
  if (!value.trim()) {
    return { valid: true }; // Valores vacios son OK
  }

  switch (type) {
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { valid: false, error: "Email no valido" };
      }
      break;
    case "url":
      try {
        new URL(value);
      } catch {
        // Permitir URLs sin protocolo
        if (!value.startsWith("http://") && !value.startsWith("https://")) {
          try {
            new URL("https://" + value);
          } catch {
            return { valid: false, error: "URL no valida" };
          }
        } else {
          return { valid: false, error: "URL no valida" };
        }
      }
      break;
    case "phone":
      // Permitir numeros, espacios, +, -, ()
      const phoneRegex = /^[+\d\s\-()]+$/;
      if (!phoneRegex.test(value)) {
        return { valid: false, error: "Telefono no valido" };
      }
      break;
  }

  return { valid: true };
};

export default function ConfigGroup({
  title,
  iconName,
  configs,
  groupKey,
}: ConfigGroupProps) {
  // Resolver icono desde el mapa
  const Icon = iconMap[iconName] || Phone;
  const [isExpanded, setIsExpanded] = useState(true);
  const [values, setValues] = useState<Record<string, string>>(
    configs.reduce(
      (acc, config) => ({ ...acc, [config.key]: config.value }),
      {},
    ),
  );
  const [saveStates, setSaveStates] = useState<SaveState>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string, type: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));

    // Limpiar estado de guardado previo
    setSaveStates((prev) => ({ ...prev, [key]: "idle" }));

    // Validar mientras escribe
    const validation = validateByType(value, type);
    if (!validation.valid) {
      setErrors((prev) => ({ ...prev, [key]: validation.error || "Error" }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSave = async (key: string, type: string) => {
    const value = values[key];

    // Validar antes de guardar
    const validation = validateByType(value, type);
    if (!validation.valid) {
      setErrors((prev) => ({ ...prev, [key]: validation.error || "Error" }));
      return;
    }

    setSaveStates((prev) => ({ ...prev, [key]: "saving" }));

    const result = await upsertConfig(key, value, type as ConfigType, groupKey);

    if (result.success) {
      setSaveStates((prev) => ({ ...prev, [key]: "saved" }));
      // Reset a idle despues de 2 segundos
      setTimeout(() => {
        setSaveStates((prev) => ({ ...prev, [key]: "idle" }));
      }, 2000);
    } else {
      setSaveStates((prev) => ({ ...prev, [key]: "error" }));
      setErrors((prev) => ({
        ...prev,
        [key]: result.error || "Error al guardar",
      }));
    }
  };

  const getInputType = (type: string) => {
    switch (type) {
      case "email":
        return "email";
      case "url":
        return "url";
      case "phone":
        return "tel";
      default:
        return "text";
    }
  };

  const getPlaceholder = (type: string, label: string) => {
    switch (type) {
      case "email":
        return "ejemplo@dominio.com";
      case "url":
        return "https://ejemplo.com";
      case "phone":
        return "+34 123 456 789";
      default:
        return `Ingresa ${label.toLowerCase()}`;
    }
  };

  return (
    <div className="bg-[#1c1f24] border border-gray-800 rounded-xl overflow-hidden">
      {/* Header colapsable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#2a2d35] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2a2d35] rounded-lg flex items-center justify-center text-red-500">
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-gray-500 text-sm">
              {configs.length} configuraciones
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Contenido */}
      {isExpanded && (
        <div className="border-t border-gray-800 p-4 space-y-4">
          {configs.map((config) => {
            const saveState = saveStates[config.key] || "idle";
            const error = errors[config.key];
            const hasChanged = values[config.key] !== config.value;

            return (
              <div key={config.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {config.label}
                  <span className="text-gray-600 text-xs ml-2">
                    ({config.type})
                  </span>
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type={getInputType(config.type)}
                      value={values[config.key]}
                      onChange={(e) =>
                        handleChange(config.key, e.target.value, config.type)
                      }
                      placeholder={
                        config.placeholder ||
                        getPlaceholder(config.type, config.label)
                      }
                      className={cn(
                        "w-full bg-[#2a2d35] border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors",
                        error
                          ? "border-red-500 focus:ring-red-500/50"
                          : "border-gray-700 focus:ring-red-500/50 focus:border-red-500",
                      )}
                    />
                    {error && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleSave(config.key, config.type)}
                    disabled={saveState === "saving" || !!error || !hasChanged}
                    className={cn(
                      "px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 min-w-[100px] justify-center",
                      saveState === "saved"
                        ? "bg-green-600 text-white"
                        : saveState === "error"
                          ? "bg-red-600 text-white"
                          : hasChanged && !error
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed",
                    )}
                  >
                    {saveState === "saving" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando</span>
                      </>
                    ) : saveState === "saved" ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Guardado</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar</span>
                      </>
                    )}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
