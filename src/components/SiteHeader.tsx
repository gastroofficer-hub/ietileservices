import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Shield } from "lucide-react";
import { Logo } from "./Logo";
import { useLang } from "@/i18n/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";

export function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);


  const nav = [
    { to: "/", label: t.nav.home },
    { to: "/services", label: t.nav.services },
    { to: "/gallery", label: t.nav.gallery },
    { to: "/pricing", label: t.nav.pricing },
    { to: "/testimonials", label: t.nav.testimonials },
    { to: "/about", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-luxe flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-muted-foreground hover:text-gold transition-smooth"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center text-xs">
            <button
              onClick={() => setLang("cs")}
              className={`px-2 py-1 transition-smooth ${lang === "cs" ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
              aria-pressed={lang === "cs"}
            >
              CZ
            </button>
            <span className="text-border">/</span>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 transition-smooth ${lang === "en" ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
          </div>

          <Link
            to="/contact"
            className="hidden md:inline-flex items-center border border-gold text-gold px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-primary-foreground transition-smooth"
          >
            {t.nav.cta}
          </Link>

          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container-luxe flex flex-col py-6 gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-foreground hover:text-gold transition-smooth font-display text-xl"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <div className="flex gap-4 pt-4 text-sm">
              <button
                onClick={() => setLang("cs")}
                className={lang === "cs" ? "text-gold" : "text-muted-foreground"}
              >
                CZ
              </button>
              <button
                onClick={() => setLang("en")}
                className={lang === "en" ? "text-gold" : "text-muted-foreground"}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
