import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CarouselPhoto = {
  id: string;
  image_url: string;
  title_cs: string;
  title_en?: string | null;
  tag?: string | null;
};

type Props = {
  photos: CarouselPhoto[];
  ratio: string;
  lang?: "cs" | "en";
  className?: string;
  onPhotoClick?: (photo: CarouselPhoto) => void;
  /** Optional caption rendered over the bottom gradient */
  showCaption?: boolean;
};

export function PhotoCarousel({
  photos,
  ratio,
  lang = "cs",
  className = "",
  onPhotoClick,
  showCaption = false,
}: Props) {
  const [i, setI] = useState(0);
  if (!photos.length) return null;
  const safeIndex = ((i % photos.length) + photos.length) % photos.length;
  const photo = photos[safeIndex];
  const title = lang === "en" ? photo.title_en ?? photo.title_cs : photo.title_cs;
  const hasMany = photos.length > 1;

  const go = (delta: number) => setI((v) => v + delta);

  return (
    <figure
      className={`relative overflow-hidden group border border-border/40 ${className}`}
    >
      <button
        type="button"
        onClick={() => onPhotoClick?.(photo)}
        className={`block w-full text-left ${onPhotoClick ? "cursor-zoom-in" : "cursor-default"}`}
        style={{ aspectRatio: ratio }}
        aria-label={title}
      >
        <img
          src={photo.image_url}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </button>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 inline-flex items-center justify-center bg-background/70 backdrop-blur-sm border border-border/60 text-foreground hover:text-gold hover:border-gold transition-smooth opacity-70 group-hover:opacity-100"
            aria-label="Předchozí"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 inline-flex items-center justify-center bg-background/70 backdrop-blur-sm border border-border/60 text-foreground hover:text-gold hover:border-gold transition-smooth opacity-70 group-hover:opacity-100"
            aria-label="Další"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute top-3 right-3 z-10 bg-background/70 backdrop-blur-sm text-[10px] tracking-[0.2em] text-foreground/90 px-2 py-1">
            {safeIndex + 1} / {photos.length}
          </div>
        </>
      )}

      {showCaption && (
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-background/90 to-transparent">
          <div className="font-display text-xl text-foreground">{title}</div>
          {photo.tag && (
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold mt-1">
              {photo.tag}
            </div>
          )}
        </figcaption>
      )}
    </figure>
  );
}
