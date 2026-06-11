import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Eyebrow } from "./index";
import { supabase } from "@/integrations/supabase/client";

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

type PageTexts = Record<string, { value_cs: string | null; value_en: string | null }>;
type Item = {
  id: string;
  title_cs: string;
  title_en: string | null;
  desc_cs: string | null;
  desc_en: string | null;
};

function ServicesPage() {
  const { t, lang } = useLang();
  const [texts, setTexts] = useState<PageTexts>({});
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: tx }, { data: si }] = await Promise.all([
        supabase.from("page_texts").select("*").in("key", ["services.title", "services.lead"]),
        supabase.from("service_items").select("*").order("sort_order"),
      ]);
      const map: PageTexts = {};
      tx?.forEach((r) => (map[r.key] = { value_cs: r.value_cs, value_en: r.value_en }));
      setTexts(map);
      if (si) setItems(si as Item[]);
    })();
  }, []);

  const pick = (cs: string | null | undefined, en: string | null | undefined, fb = "") =>
    (lang === "en" ? en || cs : cs || en) ?? fb;

  const title = pick(texts["services.title"]?.value_cs, texts["services.title"]?.value_en, t.services.title);
  const lead = pick(texts["services.lead"]?.value_cs, texts["services.lead"]?.value_en, t.services.lead);
  const list =
    items.length > 0
      ? items.map((i) => ({ t: pick(i.title_cs, i.title_en), d: pick(i.desc_cs, i.desc_en) }))
      : t.services.items;

  return (
    <section className="container-luxe py-24 lg:py-32">
      <Eyebrow>01 — {t.nav.services}</Eyebrow>
      <h1 className="font-display text-5xl sm:text-6xl mt-4 max-w-3xl">{title}</h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-xl">{lead}</p>

      <div className="mt-20 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => (
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
