import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/i18n/LanguageProvider";
import { Eyebrow } from "./index";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Služby — I&E Tile Services" },
      {
        name: "description",
        content:
          "Návrh koupelny, obklady, sanitární a elektroinstalace, renovace a výroba na míru. Kompletní servis od I&E Tile Services.",
      },
      { property: "og:title", content: "Služby — I&E Tile Services" },
      {
        property: "og:description",
        content: "Kompletní servis od návrhu po předání hotové koupelny.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useLang();
  return (
    <section className="container-luxe py-24 lg:py-32">
      <Eyebrow>01 — {t.nav.services}</Eyebrow>
      <h1 className="font-display text-5xl sm:text-6xl mt-4 max-w-3xl">{t.services.title}</h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-xl">{t.services.lead}</p>

      <div className="mt-20 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
        {t.services.items.map((s, i) => (
          <article
            key={i}
            className="bg-background p-10 group hover:bg-card transition-smooth"
          >
            <div className="text-gold text-xs tracking-[0.3em]">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h2 className="font-display text-3xl mt-6 group-hover:text-gold transition-smooth">
              {s.t}
            </h2>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{s.d}</p>
            <div className="hairline mt-8 w-12 group-hover:w-20 transition-all" />
          </article>
        ))}
      </div>
    </section>
  );
}
