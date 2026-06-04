import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Eyebrow } from "./index";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { Lightbox } from "@/components/Lightbox";
import { supabase } from "@/integrations/supabase/client";

type DbPhoto = {
  id: string;
  title_cs: string;
  title_en: string | null;
  tag: string | null;
  ratio: string;
  image_url: string;
};

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

function GalleryPage() {
  const { t, lang } = useLang();
  const [tag, setTag] = useState(0);
  const [photos, setPhotos] = useState<DbPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<DbPhoto | null>(null);

  useEffect(() => {
    supabase
      .from("gallery_photos")
      .select("id,title_cs,title_en,tag,ratio,image_url")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPhotos(data as DbPhoto[]);
        setLoading(false);
      });
  }, []);

  const activeTag = t.gallery.tags[tag];
  const filtered = useMemo(() => {
    if (tag === 0) return photos;
    return photos.filter(
      (p) => (p.tag ?? "").toLowerCase() === activeTag.toLowerCase(),
    );
  }, [photos, tag, activeTag]);

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

      {loading ? (
        <p className="mt-16 text-muted-foreground">Načítání…</p>
      ) : filtered.length === 0 ? (
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[31, 32, 33, 34, 35, 36].map((seed) => (
            <PlaceholderImage
              key={seed}
              label="Brzy připravujeme"
              seed={seed}
              ratio={seed % 2 ? "4/3" : "4/5"}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => {
            const title = lang === "en" ? p.title_en ?? p.title_cs : p.title_cs;
            return (
              <figure
                key={p.id}
                className="relative overflow-hidden group border border-border/40"
              >
                <div style={{ aspectRatio: p.ratio }} className="overflow-hidden">
                  <img
                    src={p.image_url}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-background/90 to-transparent">
                  <div className="font-display text-xl text-foreground">{title}</div>
                  {p.tag && (
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gold mt-1">
                      {p.tag}
                    </div>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}
    </section>
  );
}
