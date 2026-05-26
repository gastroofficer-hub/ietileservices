import { createFileRoute } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { Eyebrow } from "./index";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Reference — I&E Tile Services" },
      {
        name: "description",
        content:
          "Recenze klientů, kteří si u nás nechali postavit koupelnu. Reálné zkušenosti z Prahy, Brna, Olomouce a Plzně.",
      },
      { property: "og:title", content: "Reference — I&E Tile Services" },
      { property: "og:description", content: "Co o nás říkají klienti." },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { t } = useLang();
  return (
    <section className="container-luxe py-24 lg:py-32">
      <Eyebrow>04 — {t.nav.testimonials}</Eyebrow>
      <h1 className="font-display text-5xl sm:text-6xl mt-4 max-w-3xl">
        {t.testimonials.title}
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-xl">{t.testimonials.lead}</p>

      <div className="mt-16 grid md:grid-cols-2 gap-6">
        {t.testimonials.items.map((it, i) => (
          <figure
            key={i}
            className="relative p-10 border border-border bg-card/40 hover:border-gold/40 transition-smooth"
          >
            <Quote className="text-gold/30 absolute top-6 right-6" size={40} />
            <blockquote className="font-display text-2xl leading-snug text-foreground">
              "{it.quote}"
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gold/20 border border-gold text-gold flex items-center justify-center font-display">
                {it.author[0]}
              </div>
              <div>
                <div className="text-sm text-foreground">{it.author}</div>
                <div className="text-xs text-muted-foreground">{it.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
