// 🧭 MIGA DE PAN: Index de Queries CMS
// 📍 UBICACIÓN: src/queries/cms/index.ts
//
// 🎯 PORQUÉ EXISTE: Exportar todas las queries CMS desde un punto central
// 🎯 CASOS DE USO: import { getSliderBySection, getSectionContent } from "@/queries/cms"
//
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager

// Sliders
export {
  getSliderBySection,
  getSliderBySlug,
  getAllSliders,
  getSliderById,
  getSliderBySectionNoCache,
  getSliderBySlugNoCache,
  type ISlider,
  type ISliderItem,
  type ISliderWithoutItems,
} from "./getSliders";

// Section Content (Textos multiidioma)
export {
  getSectionContent,
  getSectionContentAllLocales,
  getAllSectionKeys,
  getMultipleSections,
  getSectionContentNoCache,
  getSectionContentFullNoCache,
  type ISectionContent,
  type SectionContentData,
  type HeroContent,
  type ConnectContent,
  type InspireContent,
  type LocationContent,
  type GetInTouchContent,
  type WelcomePageContent,
} from "./getSectionContent";

// Site Config (Contacto, Redes, Footer)
export {
  getConfigByGroup,
  getConfigByKey,
  getConfigsByKeys,
  getConfigMapByGroup,
  getAllConfigs,
  getAllConfigsGrouped,
  getContactInfo,
  getSocialLinks,
  getConfigByKeyNoCache,
  getConfigByGroupNoCache,
  getConfigFullNoCache,
  type ISiteConfig,
  type ConfigMap,
  type ConfigGroup,
} from "./getSiteConfig";
