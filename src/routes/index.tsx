import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { LogoMark } from "@/components/Logo";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { Lightbox } from "@/components/Lightbox";
import { supabase } from "@/integrations/supabase/client";

type DbPhoto = {
  id: string;
  title_cs: string;
  title_en: string | null;
  tag: string | null;
  ratio: string;
  image_url: string;
  hero_slot: number | null;
  featured_slot: number | null;
  hero_order: number;
  featured_order: number;
  created_at: string;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "I&E Tile Services — Koupelny na míru" },
      {
        name: "description",
        content:
          "I&E Tile Services — návrh a realizace koupelen na míru. Prémiové materiály, vlastní řemeslníci, záruka 5 let. Praha a celá ČR.",
      },
      { property: "og:title", content: "I&E Tile Services — Koupelny na míru" },
      {
        property: "og:description",
        content: "Návrh a realizace luxusních koupelen. 3D vizualizace zdarma.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});


function HomePage() {
  const { t, lang } = useLang();
  const [photos, setPhotos] = useState<DbPhoto[]>([]);
  const [lightbox, setLightbox] = useState<DbPhoto | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("gallery_photos")
        .select(
          "id,title_cs,title_en,tag,ratio,image_url,hero_slot,featured_slot,hero_order,featured_order,created_at",
        )
        .order("created_at", { ascending: false });
      if (data) setPhotos(data as DbPhoto[]);
    })();
  }, []);

  // Group photos into slot buckets and build fallback pool from recent photos
  const { heroSlots, featuredSlots } = useMemo(() => {
    const heroSlots: DbPhoto[][] = [[], []];
    const featuredSlots: DbPhoto[][] = [[], [], []];
    const used = new Set<string>();

    photos.forEach((p) => {
      if (p.hero_slot === 1 || p.hero_slot === 2) {
        heroSlots[p.hero_slot - 1].push(p);
        used.add(p.id);
      }
      if (p.featured_slot === 1 || p.featured_slot === 2 || p.featured_slot === 3) {
        featuredSlots[p.featured_slot - 1].push(p);
        used.add(p.id);
      }
    });

    heroSlots.forEach((arr) => arr.sort((a, b) => a.hero_order - b.hero_order));
    featuredSlots.forEach((arr) =>
      arr.sort((a, b) => a.featured_order - b.featured_order),
    );

    // Fallback: fill empty slots with most recent unused photos
    const pool = photos.filter((p) => !used.has(p.id));
    heroSlots.forEach((arr) => {
      if (arr.length === 0 && pool.length) arr.push(pool.shift()!);
    });
    featuredSlots.forEach((arr) => {
      if (arr.length === 0 && pool.length) arr.push(pool.shift()!);
    });

    return { heroSlots, featuredSlots };
  }, [photos]);

  const renderSlot = (slot: DbPhoto[], ratio: string, seed: number, extra = "") =>
    slot.length > 0 ? (
      <PhotoCarousel
        photos={slot}
        ratio={ratio}
        lang={lang}
        className={extra}
        onPhotoClick={(p) => setLightbox(p as DbPhoto)}
      />
    ) : (
      <PlaceholderImage ratio={ratio} seed={seed} className={extra} />
    );

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-luxe pt-20 pb-32 lg:pt-28 lg:pb-40 grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7 animate-fade-up">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-12 bg-gold" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-gold">
                {t.home.eyebrow}
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.02] text-foreground whitespace-pre-line">
              {t.home.title}
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
              {t.home.lead}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 bg-gold text-primary-foreground px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-gold-soft transition-smooth"
              >
                {t.home.ctaPrimary}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center border border-border text-foreground px-7 py-4 text-xs uppercase tracking-[0.25em] hover:border-gold hover:text-gold transition-smooth"
              >
                {t.home.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {renderSlot(heroSlots[0], "3/4", 11, "translate-y-8")}
            {renderSlot(heroSlots[1], "3/4", 12)}
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-y border-border bg-card/40">
          <div className="container-luxe grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <Stat value="10+" label={t.home.statsYears} />
            <Stat value="240+" label={t.home.statsProjects} />
            <Stat value="4.9 / 5" label={t.home.statsRating} />
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="container-luxe py-28">
        <div className="max-w-2xl">
          <Eyebrow>02 — Hodnoty</Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl mt-4">{t.home.whyTitle}</h2>
          <p className="mt-4 text-muted-foreground">{t.home.whyLead}</p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {t.home.whyItems.map((it, i) => (
            <div key={i} className="bg-background p-8 hover:bg-card transition-smooth group">
              <div className="text-gold text-xs tracking-[0.3em]">0{i + 1}</div>
              <h3 className="font-display text-2xl mt-6 group-hover:text-gold transition-smooth">
                {it.t}
              </h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{it.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="container-luxe py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <Eyebrow>03 — Realizace</Eyebrow>
            <h2 className="font-display text-4xl sm:text-5xl mt-4">{t.home.featuredTitle}</h2>
            <p className="mt-4 text-muted-foreground max-w-md">{t.home.featuredLead}</p>
          </div>
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 text-sm text-gold hover:gap-4 transition-all"
          >
            {t.home.featuredCta}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSlot(featuredSlots[0], "4/5", 21)}
          {renderSlot(featuredSlots[1], "4/5", 22)}
          {renderSlot(featuredSlots[2], "4/5", 23)}
        </div>
      </section>

      {/* CTA BLOCK */}
      <section className="container-luxe pb-28">
        <div className="relative border border-border p-12 md:p-20 overflow-hidden bg-card/40">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,var(--gold)_0%,transparent_50%)]" />
          <LogoMark className="pointer-events-none absolute -right-10 -bottom-10 w-72 md:w-96 opacity-[0.06]" />
          <div className="relative max-w-2xl">
            <Eyebrow>04 — Začněme</Eyebrow>
            <h2 className="font-display text-4xl sm:text-5xl mt-4">{t.home.ctaBlockTitle}</h2>
            <p className="mt-4 text-muted-foreground">{t.home.ctaBlockLead}</p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-3 bg-gold text-primary-foreground px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-gold-soft transition-smooth"
            >
              {t.nav.cta}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          src={lightbox.image_url}
          alt={lang === "en" ? lightbox.title_en ?? lightbox.title_cs : lightbox.title_cs}
          caption={lang === "en" ? lightbox.title_en ?? lightbox.title_cs : lightbox.title_cs}
          tag={lightbox.tag}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="py-10 text-center">
      <div className="font-display text-4xl text-gold">{value}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-gold" />
      <span className="text-[10px] uppercase tracking-[0.35em] text-gold">{children}</span>
    </div>
  );
}
