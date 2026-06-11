import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSection, FieldLabel, inputCls, textareaCls } from "./AdminShell";
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Star } from "lucide-react";

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

const emptyPkg = (): Omit<Pkg, "id"> => ({
  name_cs: "",
  name_en: "",
  price_cs: "",
  price_en: "",
  unit_cs: "",
  unit_en: "",
  desc_cs: "",
  desc_en: "",
  features_cs: [],
  features_en: [],
  featured: false,
  sort_order: 0,
});

export function AdminPricingPackages() {
  const [rows, setRows] = useState<Pkg[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [adding, setAdding] = useState<Omit<Pkg, "id">>(emptyPkg());

  const fetchRows = useCallback(async () => {
    const { data } = await supabase
      .from("pricing_packages")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setRows(data as Pkg[]);
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const updateLocal = (id: string, patch: Partial<Pkg>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const save = async (id: string) => {
    setSavingId(id);
    const r = rows.find((x) => x.id === id);
    if (!r) return;
    const { error } = await supabase
      .from("pricing_packages")
      .update({
        name_cs: r.name_cs,
        name_en: r.name_en,
        price_cs: r.price_cs,
        price_en: r.price_en,
        unit_cs: r.unit_cs,
        unit_en: r.unit_en,
        desc_cs: r.desc_cs,
        desc_en: r.desc_en,
        features_cs: r.features_cs,
        features_en: r.features_en,
        featured: r.featured,
      })
      .eq("id", id);
    setSavingId(null);
    if (error) alert(error.message);
  };

  const remove = async (id: string) => {
    if (!confirm("Smazat tento balíček?")) return;
    const { error } = await supabase.from("pricing_packages").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchRows();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = rows.findIndex((r) => r.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= rows.length) return;
    const a = rows[idx];
    const b = rows[swap];
    await Promise.all([
      supabase.from("pricing_packages").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("pricing_packages").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    fetchRows();
  };

  const addNew = async () => {
    if (!adding.name_cs.trim()) {
      alert("Vyplňte alespoň název (CZ).");
      return;
    }
    const { error } = await supabase.from("pricing_packages").insert({
      ...adding,
      sort_order: rows.length,
    });
    if (error) alert(error.message);
    else {
      setAdding(emptyPkg());
      fetchRows();
    }
  };

  const renderFeatures = (
    label: string,
    values: string[],
    onChange: (next: string[]) => void,
  ) => (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        className={textareaCls}
        value={values.join("\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        placeholder="Každá vlastnost na jeden řádek"
      />
    </div>
  );

  const renderEditor = (
    r: Omit<Pkg, "id"> & { id?: string },
    setPatch: (patch: Partial<Pkg>) => void,
  ) => (
    <div className="grid gap-3">
      <div className="grid lg:grid-cols-2 gap-3">
        <div>
          <FieldLabel>Název (CZ) *</FieldLabel>
          <input className={inputCls} value={r.name_cs} onChange={(e) => setPatch({ name_cs: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Název (EN)</FieldLabel>
          <input className={inputCls} value={r.name_en ?? ""} onChange={(e) => setPatch({ name_en: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Cena (CZ)</FieldLabel>
          <input className={inputCls} value={r.price_cs ?? ""} onChange={(e) => setPatch({ price_cs: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Cena (EN)</FieldLabel>
          <input className={inputCls} value={r.price_en ?? ""} onChange={(e) => setPatch({ price_en: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Jednotka (CZ)</FieldLabel>
          <input className={inputCls} value={r.unit_cs ?? ""} onChange={(e) => setPatch({ unit_cs: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Jednotka (EN)</FieldLabel>
          <input className={inputCls} value={r.unit_en ?? ""} onChange={(e) => setPatch({ unit_en: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Popis (CZ)</FieldLabel>
          <textarea className={textareaCls} value={r.desc_cs ?? ""} onChange={(e) => setPatch({ desc_cs: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Popis (EN)</FieldLabel>
          <textarea className={textareaCls} value={r.desc_en ?? ""} onChange={(e) => setPatch({ desc_en: e.target.value })} />
        </div>
        {renderFeatures("Vlastnosti (CZ)", r.features_cs, (v) => setPatch({ features_cs: v }))}
        {renderFeatures("Vlastnosti (EN)", r.features_en, (v) => setPatch({ features_en: v }))}
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={r.featured} onChange={(e) => setPatch({ featured: e.target.checked })} />
        <Star size={14} className="text-gold" />
        Doporučený balíček (zvýrazněný „Best value")
      </label>
    </div>
  );

  return (
    <AdminSection
      title="Cenové balíčky"
      description="Karty zobrazené na stránce Ceník."
    >
      <div className="grid gap-6">
        {rows.map((r, i) => (
          <div key={r.id} className="border border-border/60 p-4 grid gap-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold">
                #{i + 1} {r.featured && <span className="ml-2">★ doporučený</span>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => move(r.id, -1)} disabled={i === 0} className="p-1.5 text-muted-foreground hover:text-gold disabled:opacity-30">
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => move(r.id, 1)} disabled={i === rows.length - 1} className="p-1.5 text-muted-foreground hover:text-gold disabled:opacity-30">
                  <ArrowDown size={14} />
                </button>
                <button onClick={() => remove(r.id)} className="p-1.5 text-muted-foreground hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {renderEditor(r, (patch) => updateLocal(r.id, patch))}
            <div>
              <button
                onClick={() => save(r.id)}
                disabled={savingId === r.id}
                className="inline-flex items-center gap-2 border border-gold text-gold px-4 py-2 text-[11px] uppercase tracking-[0.25em] hover:bg-gold hover:text-primary-foreground transition-smooth disabled:opacity-50"
              >
                <Save size={12} /> {savingId === r.id ? "Ukládám…" : "Uložit"}
              </button>
            </div>
          </div>
        ))}

        <div className="border border-dashed border-border p-4 grid gap-3">
          <div className="text-xs uppercase tracking-[0.25em] text-gold">Přidat nový balíček</div>
          {renderEditor(adding, (patch) => setAdding((p) => ({ ...p, ...patch })))}
          <div>
            <button
              onClick={addNew}
              className="inline-flex items-center gap-2 bg-gold text-primary-foreground px-4 py-2 text-[11px] uppercase tracking-[0.25em] hover:opacity-90 transition-smooth"
            >
              <Plus size={12} /> Přidat
            </button>
          </div>
        </div>
      </div>
    </AdminSection>
  );
}
