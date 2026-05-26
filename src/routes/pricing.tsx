import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { Eyebrow } from "./index";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Ceník — I&E Tile Services" },
      {
        name: "description",
        content:
          "Orientační ceník koupelen I&E Tile Services. Tři balíčky — Essence, Signature a Atelier. Konečná cena dle rozsahu prací.",
      },
      { property: "og:title", content: "Ceník — I&E Tile Services" },
      { property: "og:description", content: "Orientační ceny balíčků koupelen na míru." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { t } = useLang();
  return (
    <section className="container-luxe py-24 lg:py-32">
      <Eyebrow>03 — {t.nav.pricing}</Eyebrow>
      <h1 className="font-display text-5xl sm:text-6xl mt-4 max-w-3xl">{t.pricing.title}</h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">{t.pricing.lead}</p>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {t.pricing.packages.map((p, i) => {
          const featured = "featured" in p && p.featured;
          return (
            <article
              key={i}
              className={`relative p-10 flex flex-col border transition-smooth ${
                featured
                  ? "border-gold bg-card shadow-gold"
                  : "border-border bg-background hover:border-gold/40"
              }`}
            >
              {featured && (
                <div className="absolute -top-3 left-10 bg-gold text-primary-foreground px-3 py-1 text-[10px] uppercase tracking-[0.3em]">
                  Best value
                </div>
              )}
              <div className="text-xs uppercase tracking-[0.3em] text-gold">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h2 className="font-display text-4xl mt-4">{p.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="font-display text-4xl text-foreground">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.unit}</span>
              </div>
              <ul className="mt-8 space-y-3 flex-1">
                {p.features.map((f, j) => (
                  <li key={j} className="flex gap-3 text-sm text-foreground/90">
                    <Check size={16} className="text-gold mt-1 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-10 inline-flex justify-center px-6 py-3 text-xs uppercase tracking-[0.25em] transition-smooth ${
                  featured
                    ? "bg-gold text-primary-foreground hover:bg-gold-soft"
                    : "border border-border text-foreground hover:border-gold hover:text-gold"
                }`}
              >
                {t.nav.cta}
              </Link>
            </article>
          );
        })}
      </div>

      <div className="mt-24">
        <h2 className="font-display text-3xl">{t.pricing.itemizedTitle}</h2>
        <div className="mt-8 border-t border-border">
          {t.pricing.items.map((it, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-5 border-b border-border group hover:px-2 transition-all"
            >
              <span className="text-foreground">{it.t}</span>
              <span className="text-gold font-display text-lg">{it.p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
