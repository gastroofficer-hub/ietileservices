import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/i18n/LanguageProvider";
import { Eyebrow } from "./index";
import { PlaceholderImage } from "@/components/PlaceholderImage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "O nás — I&E Tile Services" },
      {
        name: "description",
        content:
          "I&E Tile Services je rodinná firma s více než desetiletou tradicí ve výrobě a realizaci koupelen v Praze a po celém Česku.",
      },
      { property: "og:title", content: "O nás — I&E Tile Services" },
      { property: "og:description", content: "Rodinná firma se zaměřením na koupelny na míru." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useLang();
  return (
    <section className="container-luxe py-24 lg:py-32">
      <Eyebrow>05 — {t.nav.about}</Eyebrow>
      <h1 className="font-display text-5xl sm:text-6xl mt-4 max-w-3xl">{t.about.title}</h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">{t.about.lead}</p>

      <div className="mt-20 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <PlaceholderImage ratio="4/5" seed={41} label="Atelier I&E" />
        </div>
        <div className="lg:col-span-7 space-y-6">
          {t.about.body.map((p, i) => (
            <p key={i} className="text-foreground/90 leading-relaxed text-lg">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-24 grid md:grid-cols-3 gap-px bg-border">
        {t.about.values.map((v, i) => (
          <div key={i} className="bg-background p-10">
            <div className="text-gold text-xs tracking-[0.3em]">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="font-display text-3xl mt-6">{v.t}</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{v.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
