import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Eyebrow } from "./index";
import { TeamGallery, type TeamPhoto } from "@/components/TeamGallery";
import { supabase } from "@/integrations/supabase/client";

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

type PageTexts = Record<string, { value_cs: string | null; value_en: string | null }>;
type Paragraph = { id: string; body_cs: string; body_en: string | null; sort_order: number };
type Value = {
  id: string;
  title_cs: string;
  title_en: string | null;
  desc_cs: string | null;
  desc_en: string | null;
  sort_order: number;
};
type TeamRow = {
  id: string;
  image_url: string;
  caption_cs: string | null;
  caption_en: string | null;
};

function AboutPage() {
  const { t, lang } = useLang();
  const [texts, setTexts] = useState<PageTexts>({});
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [values, setValues] = useState<Value[]>([]);
  const [team, setTeam] = useState<TeamRow[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: tx }, { data: pa }, { data: va }, { data: tm }] = await Promise.all([
        supabase.from("page_texts").select("*").in("key", ["about.title", "about.lead"]),
        supabase.from("about_paragraphs").select("*").order("sort_order"),
        supabase.from("about_values").select("*").order("sort_order"),
        supabase.from("team_photos").select("id,image_url,caption_cs,caption_en").order("sort_order"),
      ]);
      const map: PageTexts = {};
      tx?.forEach((r) => (map[r.key] = { value_cs: r.value_cs, value_en: r.value_en }));
      setTexts(map);
      if (pa) setParagraphs(pa as Paragraph[]);
      if (va) setValues(va as Value[]);
      if (tm) setTeam(tm as TeamRow[]);
    })();
  }, []);

  const pick = (cs: string | null | undefined, en: string | null | undefined, fallback = "") =>
    (lang === "en" ? en || cs : cs || en) ?? fallback;

  const title = pick(texts["about.title"]?.value_cs, texts["about.title"]?.value_en, t.about.title);
  const lead = pick(texts["about.lead"]?.value_cs, texts["about.lead"]?.value_en, t.about.lead);

  const photos: TeamPhoto[] = team.map((p) => ({
    src: p.image_url,
    alt: pick(p.caption_cs, p.caption_en, "Tým I&E"),
    caption: pick(p.caption_cs, p.caption_en),
  }));

  return (
    <section className="container-luxe py-24 lg:py-32">
      <Eyebrow>05 — {t.nav.about}</Eyebrow>
      <h1 className="font-display text-5xl sm:text-6xl mt-4 max-w-3xl">{title}</h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">{lead}</p>

      <div className="mt-20 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 animate-fade-up">
          {photos.length > 0 && <TeamGallery photos={photos} />}
        </div>
        <div className="lg:col-span-7 space-y-6">
          {(paragraphs.length > 0
            ? paragraphs.map((p) => pick(p.body_cs, p.body_en))
            : t.about.body
          ).map((p, i) => (
            <p key={i} className="text-foreground/90 leading-relaxed text-lg">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-24 grid md:grid-cols-3 gap-px bg-border">
        {(values.length > 0
          ? values.map((v) => ({ t: pick(v.title_cs, v.title_en), d: pick(v.desc_cs, v.desc_en) }))
          : t.about.values
        ).map((v, i) => (
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
