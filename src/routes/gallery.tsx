import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Eyebrow } from "./index";
import { PlaceholderImage } from "@/components/PlaceholderImage";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Galerie — I&E Tile Services" },
      {
        name: "description",
        content:
          "Galerie dokončených koupelen od I&E Tile Services. Minimalistické, mramorové, industriální i řešení pro malé prostory.",
      },
      { property: "og:title", content: "Galerie realizací — I&E Tile Services" },
      { property: "og:description", content: "Výběr z dokončených projektů. Každá koupelna je originál." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

const PROJECTS = [
  { label: "Marble Suite — Praha 1", seed: 31, ratio: "4/5" },
  { label: "Black Mineral — Brno", seed: 32, ratio: "4/3" },
  { label: "Atelier Letná", seed: 33, ratio: "1/1" },
  { label: "Stone Pavilion", seed: 34, ratio: "4/5" },
  { label: "Penthouse Karlín", seed: 35, ratio: "4/3" },
  { label: "Bílá Linka", seed: 36, ratio: "1/1" },
  { label: "Industrial Loft", seed: 37, ratio: "4/5" },
  { label: "Travertine Room", seed: 38, ratio: "4/3" },
  { label: "Mosaic Study", seed: 39, ratio: "1/1" },
];

function GalleryPage() {
  const { t } = useLang();
  const [tag, setTag] = useState(0);

  return (
    <section className="container-luxe py-24 lg:py-32">
      <Eyebrow>02 — {t.nav.gallery}</Eyebrow>
      <h1 className="font-display text-5xl sm:text-6xl mt-4">{t.gallery.title}</h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-xl">{t.gallery.lead}</p>

      <div className="mt-12 flex flex-wrap gap-2 border-y border-border py-5">
        {t.gallery.tags.map((g, i) => (
          <button
            key={i}
            onClick={() => setTag(i)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition-smooth ${
              tag === i
                ? "bg-gold text-primary-foreground"
                : "text-muted-foreground hover:text-gold"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((p, i) => (
          <PlaceholderImage key={i} label={p.label} seed={p.seed} ratio={p.ratio} />
        ))}
      </div>
    </section>
  );
}
