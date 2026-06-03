import { Link } from "@tanstack/react-router";
import { useLang } from "@/i18n/LanguageProvider";
import logoAsset from "@/assets/logo-ie.png.asset.json";

type Props = {
  className?: string;
  /** "compact" shows only the mark; "full" shows mark + wordmark text */
  variant?: "compact" | "full";
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export function Logo({ className = "", variant = "full", size = "md" }: Props) {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group ${className}`}>
      <img
        src={logoAsset.url}
        alt="I&E Tile Services"
        className={`${sizeMap[size]} object-contain transition-smooth group-hover:opacity-90`}
      />
      {variant === "full" && (
        <span className="hidden sm:flex flex-col leading-tight">
          <span className="font-display text-base text-foreground tracking-wide">
            I&amp;E Tile Services
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <LogoTagline />
          </span>
        </span>
      )}
    </Link>
  );
}

function LogoTagline() {
  const { t } = useLang();
  return <>{t.brand.tagline}</>;
}

/** Standalone logo mark (no link), useful as a decorative element. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="I&E Tile Services"
      className={`object-contain ${className}`}
    />
  );
}
