// 🧭 MIGA DE PAN: Footer del sitio con redes sociales y copyright
// 📍 UBICACIÓN: src/app/[lang]/components/sections/footer/Footer.tsx
//
// 🎯 PORQUÉ EXISTE: Mostrar redes sociales, email y copyright del sitio
// 🎯 CASOS DE USO: Final de todas las páginas públicas
//
// 🔄 FLUJO: getSocialLinks() + getContactInfo() → Renderizar iconos con links
// 🔗 USADO EN: Layout principal, todas las páginas públicas
// ⚠️ DEPENDENCIAS: queries/cms/getSiteConfig.ts (cache 300s)
//
// 🚨 CUIDADO: Fallbacks hardcodeados SI BD vacía para evitar romper el sitio
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 3.3)

import {
  Facebook,
  InstagramIcon,
  Mail,
  YoutubeIcon,
  Twitter,
} from "lucide-react";
import {
  getSocialLinks,
  getContactInfo,
  getConfigMapByGroup,
} from "@/queries/cms/getSiteConfig";
import type { UIContent } from "@/lib/cms/sectionSchemas";

// ============================================
// FALLBACKS ARIA-LABELS (accesibilidad)
// ============================================

const FALLBACK_ACCESSIBILITY = {
  sendEmail: "Enviar email",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  twitter: "Twitter",
};

// ============================================
// FALLBACKS (valores actuales hardcodeados)
// ============================================

const FALLBACK_SOCIAL = {
  facebook: "https://www.facebook.com/theartgomagallery",
  instagram: "https://www.instagram.com/theartgomagallery",
  youtube: "https://www.youtube.com/@ArtGoMA",
  twitter: null,
  linkedin: null,
  tiktok: null,
};

const FALLBACK_CONTACT = {
  email: "info@artgoma.com",
  phone: "+34 605 620 857",
  address: "Av. Ayyo Nr. 73, Local 7, 38670 Adeje",
  whatsapp: null,
};

const FALLBACK_FOOTER = {
  copyright: "© 2023 GOMA ALL RIGHTS RESERVED",
  website: "WWW.ARTGOMA.COM",
  year: "2023",
};

// ============================================
// COMPONENTE (Server Component con async)
// ============================================

interface FooterProps {
  ui?: UIContent;
}

const Footer = async ({ ui }: FooterProps = {}) => {
  // Obtener datos de BD con cache (300s)
  const [social, contact, footerConfig] = await Promise.all([
    getSocialLinks(),
    getContactInfo(),
    getConfigMapByGroup("footer"),
  ]);

  // Aria labels con fallbacks
  const ariaLabels = {
    sendEmail: ui?.accessibility?.sendEmail ?? FALLBACK_ACCESSIBILITY.sendEmail,
    facebook: ui?.accessibility?.facebook ?? FALLBACK_ACCESSIBILITY.facebook,
    instagram: ui?.accessibility?.instagram ?? FALLBACK_ACCESSIBILITY.instagram,
    youtube: ui?.accessibility?.youtube ?? FALLBACK_ACCESSIBILITY.youtube,
    twitter: ui?.accessibility?.twitter ?? FALLBACK_ACCESSIBILITY.twitter,
  };

  // Merge con fallbacks (BD tiene prioridad)
  const socialLinks = {
    facebook: social.facebook ?? FALLBACK_SOCIAL.facebook,
    instagram: social.instagram ?? FALLBACK_SOCIAL.instagram,
    youtube: social.youtube ?? FALLBACK_SOCIAL.youtube,
    twitter: social.twitter ?? FALLBACK_SOCIAL.twitter,
  };

  const contactInfo = {
    email: contact.email ?? FALLBACK_CONTACT.email,
  };

  const footer = {
    copyright: footerConfig.copyright ?? FALLBACK_FOOTER.copyright,
    website: footerConfig.website ?? FALLBACK_FOOTER.website,
  };

  return (
    <footer className="bg-black text-white p-4 py-16">
      <div className="flex items-center justify-center space-x-4">
        {/* Email */}
        {contactInfo.email && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`mailto:${contactInfo.email}`}
            aria-label={ariaLabels.sendEmail}
          >
            <Mail className="text-white h-6 w-6 hover:text-red-600 transition-colors" />
          </a>
        )}

        {/* Facebook */}
        {socialLinks.facebook && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={socialLinks.facebook}
            aria-label={ariaLabels.facebook}
          >
            <Facebook className="text-white h-6 w-6 hover:text-red-600 transition-colors" />
          </a>
        )}

        {/* Instagram */}
        {socialLinks.instagram && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={socialLinks.instagram}
            aria-label={ariaLabels.instagram}
          >
            <InstagramIcon className="text-white h-6 w-6 hover:text-red-600 transition-colors" />
          </a>
        )}

        {/* YouTube */}
        {socialLinks.youtube && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={socialLinks.youtube}
            aria-label={ariaLabels.youtube}
          >
            <YoutubeIcon className="text-white h-6 w-6 hover:text-red-600 transition-colors" />
          </a>
        )}

        {/* Twitter/X (solo si existe en BD) */}
        {socialLinks.twitter && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={socialLinks.twitter}
            aria-label={ariaLabels.twitter}
          >
            <Twitter className="text-white h-6 w-6 hover:text-red-600 transition-colors" />
          </a>
        )}
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-4">{footer.copyright}</div>

      {/* Website */}
      <div className="text-center font-bold mt-2">{footer.website}</div>
    </footer>
  );
};

export default Footer;
