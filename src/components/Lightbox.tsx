import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  tag?: string | null;
  onClose: () => void;
};

export function Lightbox({ src, alt, caption, tag, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-foreground hover:text-gold transition-smooth"
        aria-label="Zavřít"
      >
        <X size={32} />
      </button>
      <figure
        onClick={(e) => e.stopPropagation()}
        className="max-w-7xl max-h-[90vh] flex flex-col items-center gap-4"
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[80vh] object-contain border border-border"
        />
        {(caption || tag) && (
          <figcaption className="text-center">
            {caption && <div className="font-display text-2xl">{caption}</div>}
            {tag && (
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold mt-1">
                {tag}
              </div>
            )}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
