import { Link } from "@tanstack/react-router";
import { useLang } from "@/i18n/LanguageProvider";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group ${className}`}>
      <span className="relative inline-flex h-10 w-10 items-center justify-center border border-gold text-gold font-display text-lg leading-none transition-smooth group-hover:bg-gold group-hover:text-primary-foreground">
        <span className="tracking-tighter">I&amp;E</span>
      </span>
      <span className="hidden sm:flex flex-col leading-tight">
        <span className="font-display text-base text-foreground">I&amp;E Tile Services</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <LogoTagline />
        </span>
      </span>
    </Link>
  );
}

function LogoTagline() {
  const { t } = useLang();
  return <>{t.brand.tagline}</>;
}
