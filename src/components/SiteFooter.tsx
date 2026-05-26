import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useLang } from "@/i18n/LanguageProvider";

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border mt-32 bg-card/40">
      <div className="container-luxe py-16 grid gap-12 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-6 text-sm text-muted-foreground max-w-xs">{t.footer.desc}</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-5">{t.footer.nav}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="text-muted-foreground hover:text-foreground transition-smooth">{t.nav.services}</Link></li>
            <li><Link to="/gallery" className="text-muted-foreground hover:text-foreground transition-smooth">{t.nav.gallery}</Link></li>
            <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-smooth">{t.nav.pricing}</Link></li>
            <li><Link to="/testimonials" className="text-muted-foreground hover:text-foreground transition-smooth">{t.nav.testimonials}</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-smooth">{t.nav.about}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-5">{t.footer.contact}</h4>
          <address className="not-italic text-sm text-muted-foreground space-y-2">
            <div>{t.contact.addressLine}</div>
            <div><a href={`tel:${t.contact.phoneValue.replace(/\s/g, "")}`} className="hover:text-foreground transition-smooth">{t.contact.phoneValue}</a></div>
            <div><a href={`mailto:${t.contact.emailValue}`} className="hover:text-foreground transition-smooth">{t.contact.emailValue}</a></div>
            <div>{t.contact.hoursValue}</div>
          </address>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-luxe py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} I&amp;E Tile Services. {t.footer.rights}</div>
          <div className="tracking-[0.25em] uppercase text-gold/70">Praha · Brno · Olomouc</div>
        </div>
      </div>
    </footer>
  );
}
