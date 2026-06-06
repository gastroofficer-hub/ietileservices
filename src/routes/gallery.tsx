import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Eyebrow } from "./index";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { Lightbox } from "@/components/Lightbox";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

type DbPhoto = {
  id: string;
  title_cs: string;
  title_en: string | null;
  tag: string | null;
  ratio: string;
  image_url: string;
  created_at: string;
  sort_order: number;
};

type SortOption = "newest" | "oldest" | "nameAsc" | "nameDesc";

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
  const [photos, setPhotos] = useState<DbPhoto[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string>("Vše");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<DbPhoto | null>(null);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    supabase
      .from("gallery_photos")
      .select("id,title_cs,title_en,tag,ratio,image_url,created_at,sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPhotos(data as DbPhoto[]);
        setLoading(false);
      });

    supabase
      .from("gallery_tags")
      .select("name")
      .order("name", { ascending: true })
      .then(({ data }) => {
        if (data) {
          const allTags = data.map((d) => d.name).filter(Boolean) as string[];
          setTags(allTags);
        }
      });
  }, []);

  const allTags = useMemo(() => {
    const label = lang === "en" ? "All" : "Vše";
    return [label, ...tags];
  }, [tags, lang]);

  const filtered = useMemo(() => {
    const labelAll = lang === "en" ? "All" : "Vše";
    let result = activeTag === labelAll ? photos : photos.filter((p) => p.tag === activeTag);

    switch (sortBy) {
      case "newest":
        result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result = [...result].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "nameAsc":
        result = [...result].sort((a, b) => a.title_cs.localeCompare(b.title_cs));
        break;
      case "nameDesc":
        result = [...result].sort((a, b) => b.title_cs.localeCompare(a.title_cs));
        break;
    }
    return result;
  }, [photos, activeTag, sortBy, lang]);

  const sortLabelMap: Record<SortOption, string> = {
    newest: t.gallery.sortNewest,
    oldest: t.gallery.sortOldest,
    nameAsc: t.gallery.sortNameAsc,
    nameDesc: t.gallery.sortNameDesc,
  };

  return (
    <section className="container-luxe py-24 lg:py-32">
      <Eyebrow>02 — {t.nav.gallery}</Eyebrow>
      <h1 className="font-display text-5xl sm:text-6xl mt-4">{t.gallery.title}</h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-xl">{t.gallery.lead}</p>

      <div className="mt-12 border-y border-border py-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
        {/* Tag filters */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tagName) => (
            <button
              key={tagName}
              onClick={() => setActiveTag(tagName)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition-smooth ${
                activeTag === tagName
                  ? "bg-gold text-primary-foreground"
                  : "text-muted-foreground hover:text-gold"
              }`}
            >
              {tagName}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="relative lg:ml-auto">
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-smooth border border-border/40"
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
          >
            <SlidersHorizontal size={14} />
            {t.gallery.sortLabel}: {sortLabelMap[sortBy]}
            <ChevronDown size={14} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
              <ul
                role="listbox"
                className="absolute right-0 top-full mt-2 z-50 min-w-[200px] border border-border bg-card shadow-elegant"
              >
                {(["newest", "oldest", "nameAsc", "nameDesc"] as SortOption[]).map((opt) => (
                  <li key={opt}>
                    <button
                      role="option"
                      aria-selected={sortBy === opt}
                      onClick={() => {
                        setSortBy(opt);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs uppercase tracking-[0.15em] transition-smooth ${
                        sortBy === opt
                          ? "text-gold bg-gold/10"
                          : "text-muted-foreground hover:text-gold hover:bg-gold/5"
                      }`}
                    >
                      {sortLabelMap[opt]}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
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
                <button
                  type="button"
                  onClick={() => setLightbox(p)}
                  className="block w-full text-left cursor-zoom-in"
                  style={{ aspectRatio: p.ratio }}
                  aria-label={title}
                >
                  <img
                    src={p.image_url}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </button>
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-background/90 to-transparent">
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

      {lightbox && (
        <Lightbox
          src={lightbox.image_url}
          alt={lang === "en" ? lightbox.title_en ?? lightbox.title_cs : lightbox.title_cs}
          caption={lang === "en" ? lightbox.title_en ?? lightbox.title_cs : lightbox.title_cs}
          tag={lightbox.tag}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
