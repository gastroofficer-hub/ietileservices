import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSection, FieldLabel, inputCls, textareaCls } from "./AdminShell";
import { Plus, Trash2, Save, ArrowUp, ArrowDown } from "lucide-react";

type ColSpec = {
  key: string; // base field name, e.g. "title", "body", "desc", "price"
  label: string;
  multiline?: boolean;
  required?: boolean;
};

type Row = Record<string, any> & { id: string; sort_order: number };

/**
 * Generic CRUD for bilingual tables with sort_order.
 * For each col `key`, the DB has columns `${key}_cs` and `${key}_en`.
 */
export function AdminBilingualList({
  title,
  description,
  table,
  cols,
  extraFields,
}: {
  title: string;
  description?: string;
  table: "service_items" | "about_values" | "about_paragraphs" | "pricing_items";
  cols: ColSpec[];
  extraFields?: ColSpec[]; // non-bilingual extras (not used yet)
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [adding, setAdding] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    const { data } = await supabase
      .from(table)
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setRows(data as Row[]);
  }, [table]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const updateLocal = (id: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const saveRow = async (id: string) => {
    setSavingId(id);
    const r = rows.find((x) => x.id === id);
    if (!r) return;
    const patch: Record<string, any> = {};
    cols.forEach((c) => {
      patch[`${c.key}_cs`] = r[`${c.key}_cs`] ?? "";
      patch[`${c.key}_en`] = r[`${c.key}_en`] ?? null;
    });
    const { error } = await supabase.from(table).update(patch as any).eq("id", id);
    setSavingId(null);
    if (error) alert(error.message);
  };

  const deleteRow = async (id: string) => {
    if (!confirm("Smazat tento záznam?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
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
      supabase.from(table).update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from(table).update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    fetchRows();
  };

  const addNew = async () => {
    const cs = adding[`${cols[0].key}_cs`]?.trim();
    if (!cs) {
      alert(`Vyplňte alespoň ${cols[0].label} (CZ).`);
      return;
    }
    const payload: Record<string, any> = {
      sort_order: rows.length,
    };
    cols.forEach((c) => {
      payload[`${c.key}_cs`] = adding[`${c.key}_cs`] ?? "";
      payload[`${c.key}_en`] = adding[`${c.key}_en`] ?? null;
    });
    const { error } = await supabase.from(table).insert(payload as any);
    if (error) alert(error.message);
    else {
      setAdding({});
      fetchRows();
    }
  };

  return (
    <AdminSection title={title} description={description}>
      <div className="grid gap-6">
        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground">Zatím žádné záznamy.</p>
        )}
        {rows.map((r, i) => (
          <div key={r.id} className="border border-border/60 p-4 grid gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold">
                #{i + 1}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(r.id, -1)}
                  className="p-1.5 text-muted-foreground hover:text-gold disabled:opacity-30"
                  disabled={i === 0}
                  aria-label="Posunout nahoru"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(r.id, 1)}
                  className="p-1.5 text-muted-foreground hover:text-gold disabled:opacity-30"
                  disabled={i === rows.length - 1}
                  aria-label="Posunout dolů"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteRow(r.id)}
                  className="p-1.5 text-muted-foreground hover:text-red-400"
                  aria-label="Smazat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {cols.map((c) => {
              const Input = c.multiline ? "textarea" : "input";
              const cls = c.multiline ? textareaCls : inputCls;
              return (
                <div key={c.key} className="grid lg:grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>{c.label} (CZ)</FieldLabel>
                    <Input
                      className={cls}
                      value={r[`${c.key}_cs`] ?? ""}
                      onChange={(e) =>
                        updateLocal(r.id, {
                          [`${c.key}_cs`]: (e.target as HTMLInputElement).value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <FieldLabel>{c.label} (EN)</FieldLabel>
                    <Input
                      className={cls}
                      value={r[`${c.key}_en`] ?? ""}
                      onChange={(e) =>
                        updateLocal(r.id, {
                          [`${c.key}_en`]: (e.target as HTMLInputElement).value,
                        })
                      }
                    />
                  </div>
                </div>
              );
            })}
            <div>
              <button
                type="button"
                onClick={() => saveRow(r.id)}
                disabled={savingId === r.id}
                className="inline-flex items-center gap-2 border border-gold text-gold px-4 py-2 text-[11px] uppercase tracking-[0.25em] hover:bg-gold hover:text-primary-foreground transition-smooth disabled:opacity-50"
              >
                <Save size={12} /> {savingId === r.id ? "Ukládám…" : "Uložit"}
              </button>
            </div>
          </div>
        ))}

        {/* Add new */}
        <div className="border border-dashed border-border p-4 grid gap-3">
          <div className="text-xs uppercase tracking-[0.25em] text-gold">Přidat nový</div>
          {cols.map((c) => {
            const Input = c.multiline ? "textarea" : "input";
            const cls = c.multiline ? textareaCls : inputCls;
            return (
              <div key={c.key} className="grid lg:grid-cols-2 gap-3">
                <div>
                  <FieldLabel>{c.label} (CZ) {c.required !== false ? "*" : ""}</FieldLabel>
                  <Input
                    className={cls}
                    value={adding[`${c.key}_cs`] ?? ""}
                    onChange={(e) =>
                      setAdding((p) => ({
                        ...p,
                        [`${c.key}_cs`]: (e.target as HTMLInputElement).value,
                      }))
                    }
                  />
                </div>
                <div>
                  <FieldLabel>{c.label} (EN)</FieldLabel>
                  <Input
                    className={cls}
                    value={adding[`${c.key}_en`] ?? ""}
                    onChange={(e) =>
                      setAdding((p) => ({
                        ...p,
                        [`${c.key}_en`]: (e.target as HTMLInputElement).value,
                      }))
                    }
                  />
                </div>
              </div>
            );
          })}
          <div>
            <button
              type="button"
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
