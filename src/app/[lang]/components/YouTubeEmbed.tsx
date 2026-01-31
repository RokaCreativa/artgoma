// 🧭 MIGA DE PAN: YouTubeEmbed - Componente responsive para embeber videos de YouTube
// 📍 UBICACIÓN: src/app/[lang]/components/YouTubeEmbed.tsx
//
// 🎯 PORQUÉ EXISTE: Mostrar videos de YouTube de forma responsive en carousels y secciones
// 🎯 CASOS DE USO: Carousel de videos (stories), videos en secciones
//
// 🔄 FLUJO: youtubeId → getYouTubeEmbedUrl() → iframe responsive
// 🔗 USADO EN: Carousel2.tsx, EmblaCarousel2.tsx
// ⚠️ DEPENDENCIAS: @/lib/cms/youtube (utilidades YouTube)
//
// 🚨 CUIDADO: Los iframes de YouTube requieren allow="autoplay" para autoplay
// 📋 SPEC: SPEC-26-01-2026-CMS-ContentManager (Tarea 1.9)

"use client";

import { useRef, useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/cms/youtube";
import { useDictionary } from "@/providers/DictionaryProvider";

interface YouTubeEmbedProps {
  youtubeId: string;
  title?: string;
  /** Aspect ratio: "vertical" (9:16), "horizontal" (16:9), "square" (1:1) */
  aspectRatio?: "vertical" | "horizontal" | "square";
  /** Autoplay when visible (muted required) */
  autoplay?: boolean;
  /** Show play/pause button */
  showControls?: boolean;
  /** Custom className for the container */
  className?: string;
  /** Thumbnail quality */
  thumbnailQuality?: "default" | "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault";
  /** Use lite mode (thumbnail + click to load) for performance */
  liteMode?: boolean;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  youtubeId,
  title = "YouTube video",
  aspectRatio = "vertical",
  autoplay = false,
  showControls = true,
  className = "",
  thumbnailQuality = "hqdefault",
  liteMode = true,
}) => {
  // DEBUG: Verificar youtubeId recibido
  console.log('[YouTubeEmbed] Rendering with youtubeId:', youtubeId, 'title:', title);

  const { ui } = useDictionary();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(!liteMode);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isVisible, setIsVisible] = useState(false);

  // Accessibility labels from dictionary with fallbacks
  const playLabel = ui?.accessibility?.play ?? "Play";
  const pauseLabel = ui?.accessibility?.pause ?? "Pause";

  // Aspect ratio classes
  const aspectClasses = {
    vertical: "aspect-[9/16]",
    horizontal: "aspect-video",
    square: "aspect-square",
  };

  // IntersectionObserver for visibility-based loading/playing
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
          // Auto-load when visible if liteMode and autoplay
          if (entry.isIntersecting && liteMode && autoplay && !isLoaded) {
            setIsLoaded(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [liteMode, autoplay, isLoaded]);

  const handlePlayClick = () => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
    setIsPlaying(true);
  };

  const handlePauseClick = () => {
    setIsPlaying(false);
    // Note: Can't actually pause iframe, would need YouTube API
    // For now, just toggle the visual state
  };

  const embedUrl = getYouTubeEmbedUrl(youtubeId, {
    autoplay: isPlaying && isVisible,
    mute: true, // Required for autoplay
    loop: true,
    controls: false,
  });

  const thumbnailUrl = getYouTubeThumbnail(youtubeId, thumbnailQuality);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl bg-black ${aspectClasses[aspectRatio]} ${className}`}
    >
      {/* Thumbnail (lite mode) or iframe */}
      {!isLoaded ? (
        // Lite mode: Show thumbnail with play button
        <button
          onClick={handlePlayClick}
          className="absolute inset-0 w-full h-full group cursor-pointer"
          aria-label={`${playLabel} ${title}`}
        >
          {/* Thumbnail */}
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
            </div>
          </div>
        </button>
      ) : (
        // Full iframe
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      )}

      {/* Play/Pause control button (when loaded) */}
      {isLoaded && showControls && (
        <button
          onClick={isPlaying ? handlePauseClick : handlePlayClick}
          className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full z-10 transition-colors"
          aria-label={isPlaying ? pauseLabel : playLabel}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </button>
      )}
    </div>
  );
};

export default YouTubeEmbed;
