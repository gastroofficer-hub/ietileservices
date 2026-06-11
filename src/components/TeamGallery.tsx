import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Lightbox } from "./Lightbox";

export type TeamPhoto = {
  src: string;
  alt: string;
  caption?: string;
};

type Props = {
  photos: TeamPhoto[];
};

export function TeamGallery({ photos }: Props) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (photos.length === 0) return null;

  const current = photos[index];
  const hasMany = photos.length > 1;

  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setIndex((i) => (i + 1) % photos.length);

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden bg-card border border-border group"
        style={{ aspectRatio: "4/5" }}
      >
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute inset-0 w-full h-full"
          aria-label="Otevřít fotku"
        >
          {/* key forces remount on change → fade-up animation re-runs */}
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover animate-fade-up"
          />
        </button>

        <div className="pointer-events-none absolute top-3 right-3 bg-background/70 backdrop-blur-sm border border-border px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Expand size={14} className="text-gold" />
        </div>

        {hasMany && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Předchozí"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm border border-border p-2 hover:bg-background hover:text-gold transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Další"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm border border-border p-2 hover:bg-background hover:text-gold transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Fotka ${i + 1}`}
                  className={`h-1.5 w-6 transition-colors ${
                    i === index ? "bg-gold" : "bg-foreground/30 hover:bg-foreground/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMany && (
        <div className="grid grid-cols-4 gap-2">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative overflow-hidden border transition-all ${
                i === index
                  ? "border-gold opacity-100"
                  : "border-border opacity-60 hover:opacity-100"
              }`}
              style={{ aspectRatio: "1/1" }}
              aria-label={`Vybrat fotku ${i + 1}`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover animate-fade-up"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <Lightbox
          src={current.src}
          alt={current.alt}
          caption={current.caption}
          onClose={() => setLightbox(false)}
        />
      )}
    </div>
  );
}
