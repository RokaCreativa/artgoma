// 🧭 MIGA DE PAN: Seccion de contacto con telefono, email y direccion
// 📍 UBICACIÓN: src/app/[lang]/components/sections/getInTouch/GetInTouch.tsx
//
// 🎯 PORQUÉ EXISTE: Mostrar informacion de contacto (tel, email, direccion) del sitio
// 🎯 CASOS DE USO: Pagina principal, seccion antes del footer
//
// 🔄 FLUJO: getContactInfo() → Renderizar datos de contacto con iconos
// 🔗 USADO EN: Pagina principal (page.tsx), posiblemente otras paginas
// ⚠️ DEPENDENCIAS: queries/cms/getSiteConfig.ts (cache 300s), configs/dictionary.ts
//
// 🚨 CUIDADO: Fallbacks hardcodeados SI BD vacia para evitar romper el sitio
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 3.3)

import Image from "next/image";
import H2GetInTouch from "./H2GetInTouch";
import { Mail, MapPinIcon, PhoneCall, User2Icon } from "lucide-react";
import { Locale } from "@/configs/i18n.config";
import { getDictionary } from "@/configs/dictionary";
import { getContactInfo, getConfigByKey } from "@/queries/cms/getSiteConfig";

// ============================================
// FALLBACKS (valores actuales hardcodeados)
// ============================================

const FALLBACK_CONTACT = {
  phone: "+34 605 620 857",
  email: "info@artgoma.com",
  address: "Av. Ayyo Nr. 73, Local 7, 38670 Adeje",
  mapsLink: "https://maps.app.goo.gl/gj1YJZ8sSVYZ6zQg6",
};

// ============================================
// COMPONENTE (Server Component con async)
// ============================================

const GetInTouch = async ({ lang }: { lang: Locale }) => {
  // Obtener diccionario para textos traducidos
  const { getInTouch } = await getDictionary(lang);

  // Obtener datos de contacto de BD con cache (300s)
  const [contactData, mapsLinkData] = await Promise.all([
    getContactInfo(),
    getConfigByKey("maps_link"),
  ]);

  // Merge con fallbacks (BD tiene prioridad)
  const contact = {
    phone: contactData.phone ?? FALLBACK_CONTACT.phone,
    email: contactData.email ?? FALLBACK_CONTACT.email,
    address: contactData.address ?? FALLBACK_CONTACT.address,
    mapsLink: mapsLinkData ?? FALLBACK_CONTACT.mapsLink,
  };

  return (
    <div className="bg-[#1c1f24] pb-16">
      <div className="flex justify-end px-10 lg:px-32">
        <H2GetInTouch text={getInTouch.h1} />
      </div>
      <div className="flex flex-col md:flex-row items-end justify-between pl-16 pr-10 lg:pr-32 pt-6 md:pt-16">
        <Image
          className="hidden md:block"
          width={400}
          height={100}
          src={"/Logo Goma horizontal.svg"}
          alt="Logo Goma horizontal"
        />
        <div className="flex flex-col w-11/12 md:w-3/5 lg:w-1/3">
          {/* Header Contacto */}
          <div className="flex items-center justify-between border border-red-600 rounded-3xl overflow-hidden mb-4">
            <p className="text-white px-4">{getInTouch.contact}</p>
            <div className="flex justify-center bg-red-600 p-2">
              <User2Icon fill="#ffffff" stroke="none" height={40} width={40} />
            </div>
          </div>

          {/* Telefono */}
          {contact.phone && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`tel:${contact.phone}`}
              className="flex justify-between gap-2 mb-2 px-4 hover:text-red-600 transition-colors group"
            >
              <PhoneCall
                fill="#ffffff"
                stroke="none"
                className="group-hover:fill-red-600 transition-colors"
              />
              <p className="text-white font-semibold group-hover:text-red-600 transition-colors">
                {contact.phone}
              </p>
            </a>
          )}

          {/* Email */}
          {contact.email && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`mailto:${contact.email}`}
              className="flex justify-between gap-2 px-4 hover:text-red-600 transition-colors group"
            >
              <Mail
                stroke="#ffffff"
                className="group-hover:stroke-red-600 transition-colors"
              />
              <p className="text-white font-semibold group-hover:text-red-600 transition-colors">
                {contact.email}
              </p>
            </a>
          )}

          {/* Direccion */}
          {contact.address && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={contact.mapsLink}
              className="flex justify-between gap-2 px-4 py-1 hover:text-red-600 transition-colors group"
            >
              <MapPinIcon
                stroke="#ffffff"
                className="group-hover:stroke-red-600 transition-colors flex-shrink-0"
              />
              <p className="text-white font-semibold text-end group-hover:text-red-600 transition-colors">
                {contact.address}
              </p>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;
