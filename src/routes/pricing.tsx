import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { Eyebrow } from "./index";
import { supabase } from "@/integrations/supabase/client";

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

type PageTexts = Record<string, { value_cs: string | null; value_en: string | null }>;
type Pkg = {
  id: string;
  name_cs: string;
  name_en: string | null;
  price_cs: string | null;
  price_en: string | null;
  unit_cs: string | null;
  unit_en: string | null;
  desc_cs: string | null;
  desc_en: string | null;
  features_cs: string[];
  features_en: string[];
  featured: boolean;
  sort_order: number;
};
type LineItem = {
  id: string;
  title_cs: string;
  title_en: string | null;
  price_cs: string | null;
  price_en: string | null;
};

function PricingPage() {
  const { t, lang } = useLang();
  const [texts, setTexts] = useState<PageTexts>({});
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [items, setItems] = useState<LineItem[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: tx }, { data: pk }, { data: it }] = await Promise.all([
        supabase
          .from("page_texts")
          .select("*")
          .in("key", ["pricing.title", "pricing.lead", "pricing.itemizedTitle"]),
        supabase.from("pricing_packages").select("*").order("sort_order"),
        supabase.from("pricing_items").select("*").order("sort_order"),
      ]);
      const map: PageTexts = {};
      tx?.forEach((r) => (map[r.key] = { value_cs: r.value_cs, value_en: r.value_en }));
      setTexts(map);
      if (pk) setPackages(pk as Pkg[]);
      if (it) setItems(it as LineItem[]);
    })();
  }, []);

  const pick = (cs: string | null | undefined, en: string | null | undefined, fb = "") =>
    (lang === "en" ? en || cs : cs || en) ?? fb;
  const pickArr = (cs: string[] | null | undefined, en: string[] | null | undefined) =>
    lang === "en" ? (en && en.length > 0 ? en : cs ?? []) : cs ?? [];

  const title = pick(texts["pricing.title"]?.value_cs, texts["pricing.title"]?.value_en, t.pricing.title);
  const lead = pick(texts["pricing.lead"]?.value_cs, texts["pricing.lead"]?.value_en, t.pricing.lead);
  const itemizedTitle = pick(
    texts["pricing.itemizedTitle"]?.value_cs,
    texts["pricing.itemizedTitle"]?.value_en,
    t.pricing.itemizedTitle,
  );

  const renderPackages = packages.length > 0
    ? packages.map((p) => ({
        name: pick(p.name_cs, p.name_en),
        price: pick(p.price_cs, p.price_en),
        unit: pick(p.unit_cs, p.unit_en),
        desc: pick(p.desc_cs, p.desc_en),
        features: pickArr(p.features_cs, p.features_en),
        featured: p.featured,
      }))
    : t.pricing.packages.map((p) => ({
        name: p.name,
        price: p.price,
        unit: p.unit,
        desc: p.desc,
        features: p.features,
        featured: "featured" in p && (p as any).featured,
      }));

  const renderItems = items.length > 0
    ? items.map((i) => ({ t: pick(i.title_cs, i.title_en), p: pick(i.price_cs, i.price_en) }))
    : t.pricing.items;

  return (
    <section className="container-luxe py-24 lg:py-32">
      <Eyebrow>03 — {t.nav.pricing}</Eyebrow>
      <h1 className="font-display text-5xl sm:text-6xl mt-4 max-w-3xl">{title}</h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">{lead}</p>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {renderPackages.map((p, i) => (
          <article
            key={i}
            className={`relative p-10 flex flex-col border transition-smooth ${
              p.featured
                ? "border-gold bg-card shadow-gold"
                : "border-border bg-background hover:border-gold/40"
            }`}
          >
            {p.featured && (
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
                p.featured
                  ? "bg-gold text-primary-foreground hover:bg-gold-soft"
                  : "border border-border text-foreground hover:border-gold hover:text-gold"
              }`}
            >
              {t.nav.cta}
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-24">
        <h2 className="font-display text-3xl">{itemizedTitle}</h2>
        <div className="mt-8 border-t border-border">
          {renderItems.map((it, i) => (
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
