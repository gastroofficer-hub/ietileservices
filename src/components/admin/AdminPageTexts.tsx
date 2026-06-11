import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSection, FieldLabel, inputCls, textareaCls } from "./AdminShell";
import { Save } from "lucide-react";

type Row = { key: string; value_cs: string | null; value_en: string | null };

type FieldSpec = {
  key: string;
  label: string;
  multiline?: boolean;
};

export function AdminPageTexts({
  title,
  description,
  fields,
}: {
  title: string;
  description?: string;
  fields: FieldSpec[];
}) {
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const keys = fields.map((f) => f.key);
      const { data } = await supabase
        .from("page_texts")
        .select("*")
        .in("key", keys);
      const map: Record<string, Row> = {};
      keys.forEach((k) => {
        const found = data?.find((d) => d.key === k);
        map[k] = found ?? { key: k, value_cs: "", value_en: "" };
      });
      setRows(map);
    })();
  }, [fields]);

  const update = (key: string, lang: "cs" | "en", value: string) =>
    setRows((prev) => ({
      ...prev,
      [key]: { ...prev[key], [`value_${lang}`]: value },
    }));

  const save = async (key: string) => {
    setSaving(key);
    const r = rows[key];
    const { error } = await supabase.from("page_texts").upsert({
      key,
      value_cs: r.value_cs ?? "",
      value_en: r.value_en ?? "",
      updated_at: new Date().toISOString(),
    });
    setSaving(null);
    if (error) alert(error.message);
  };

  return (
    <AdminSection title={title} description={description}>
      <div className="grid gap-6">
        {fields.map((f) => {
          const r = rows[f.key];
          if (!r) return null;
          const Input = f.multiline ? "textarea" : "input";
          const cls = f.multiline ? textareaCls : inputCls;
          return (
            <div key={f.key} className="grid lg:grid-cols-2 gap-4 border-b border-border/60 pb-6 last:border-0 last:pb-0">
              <div className="lg:col-span-2">
                <div className="text-xs uppercase tracking-[0.25em] text-gold">{f.label}</div>
              </div>
              <div>
                <FieldLabel>CZ</FieldLabel>
                <Input
                  className={cls}
                  value={r.value_cs ?? ""}
                  onChange={(e) => update(f.key, "cs", (e.target as HTMLInputElement).value)}
                />
              </div>
              <div>
                <FieldLabel>EN</FieldLabel>
                <Input
                  className={cls}
                  value={r.value_en ?? ""}
                  onChange={(e) => update(f.key, "en", (e.target as HTMLInputElement).value)}
                />
              </div>
              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={() => save(f.key)}
                  disabled={saving === f.key}
                  className="inline-flex items-center gap-2 border border-gold text-gold px-4 py-2 text-[11px] uppercase tracking-[0.25em] hover:bg-gold hover:text-primary-foreground transition-smooth disabled:opacity-50"
                >
                  <Save size={12} /> {saving === f.key ? "Ukládám…" : "Uložit"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminSection>
  );
}
