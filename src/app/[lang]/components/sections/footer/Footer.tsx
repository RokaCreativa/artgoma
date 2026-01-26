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

const Footer = async () => {
  // Obtener datos de BD con cache (300s)
  const [social, contact, footerConfig] = await Promise.all([
    getSocialLinks(),
    getContactInfo(),
    getConfigMapByGroup("footer"),
  ]);

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
            aria-label="Enviar email"
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
            aria-label="Facebook"
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
            aria-label="Instagram"
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
            aria-label="YouTube"
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
            aria-label="Twitter"
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
