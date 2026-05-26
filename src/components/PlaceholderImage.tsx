type Props = {
  label?: string;
  ratio?: string; // e.g. "4/3", "1/1"
  className?: string;
  seed?: number;
};

// Elegant placeholder block with gold accent + subtle pattern.
// Replace with <img> once real photos are provided.
export function PlaceholderImage({ label, ratio = "4/3", className = "", seed = 1 }: Props) {
  const angle = (seed * 37) % 180;
  const shade = 14 + ((seed * 5) % 10);
  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      style={{
        aspectRatio: ratio,
        background: `linear-gradient(${angle}deg, oklch(0.${shade} 0 0), oklch(0.${shade + 4} 0 0))`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, oklch(0.95 0 0) 0 1px, transparent 1px 22px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-background/50 via-transparent to-transparent" />
      <div className="absolute left-5 top-5 h-px w-12 bg-gold" />
      <div className="absolute right-5 bottom-5 text-[10px] uppercase tracking-[0.3em] text-gold/80">
        I&amp;E · {String(seed).padStart(2, "0")}
      </div>
      {label && (
        <div className="absolute left-5 bottom-5 font-display text-xl text-foreground/90 max-w-[70%]">
          {label}
        </div>
      )}
      <div className="absolute inset-0 ring-0 ring-gold/0 group-hover:ring-1 group-hover:ring-gold/40 transition-smooth" />
    </div>
  );
}
