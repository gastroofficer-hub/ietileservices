import { useCallback, useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSection, FieldLabel, inputCls } from "./AdminShell";
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type TeamPhoto = {
  id: string;
  image_url: string;
  storage_path: string;
  caption_cs: string | null;
  caption_en: string | null;
  sort_order: number;
};

export function AdminTeam() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<TeamPhoto[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [captionCs, setCaptionCs] = useState("");
  const [captionEn, setCaptionEn] = useState("");
  const [uploading, setUploading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    const { data } = await supabase
      .from("team_photos")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setPhotos(data as TeamPhoto[]);
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const onUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `team/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("gallery")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      const { error: insErr } = await supabase.from("team_photos").insert({
        image_url: pub.publicUrl,
        storage_path: path,
        caption_cs: captionCs || null,
        caption_en: captionEn || null,
        sort_order: photos.length,
      });
      if (insErr) throw insErr;
      setFile(null);
      setCaptionCs("");
      setCaptionEn("");
      const fi = document.getElementById("team-file-input") as HTMLInputElement | null;
      if (fi) fi.value = "";
      await fetchPhotos();
    } catch (err: any) {
      alert(err?.message ?? "Nahrání selhalo");
    } finally {
      setUploading(false);
    }
  };

  const updateLocal = (id: string, patch: Partial<TeamPhoto>) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const save = async (p: TeamPhoto) => {
    setSavingId(p.id);
    const { error } = await supabase
      .from("team_photos")
      .update({ caption_cs: p.caption_cs, caption_en: p.caption_en })
      .eq("id", p.id);
    setSavingId(null);
    if (error) alert(error.message);
  };

  const remove = async (p: TeamPhoto) => {
    if (!confirm("Smazat tuto fotku?")) return;
    if (p.storage_path && !p.storage_path.startsWith("asset:")) {
      await supabase.storage.from("gallery").remove([p.storage_path]);
    }
    await supabase.from("team_photos").delete().eq("id", p.id);
    fetchPhotos();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = photos.findIndex((p) => p.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= photos.length) return;
    const a = photos[idx];
    const b = photos[swap];
    await Promise.all([
      supabase.from("team_photos").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("team_photos").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    fetchPhotos();
  };

  return (
    <AdminSection
      title="Týmové fotky (sekce O nás)"
      description={'Mini-galerie fotek zobrazená v sekci „O nás". Pořadí lze měnit šipkami.'}
    >
      <form onSubmit={onUpload} className="border border-dashed border-border p-4 grid gap-3 mb-8">
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Nahrát novou fotku</div>
        <div className="grid lg:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Popisek (CZ)</FieldLabel>
            <input value={captionCs} onChange={(e) => setCaptionCs(e.target.value)} className={inputCls} />
          </div>
          <div>
            <FieldLabel>Popisek (EN)</FieldLabel>
            <input value={captionEn} onChange={(e) => setCaptionEn(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <FieldLabel>Soubor *</FieldLabel>
          <input
            id="team-file-input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border file:border-gold file:bg-transparent file:text-gold file:uppercase file:tracking-[0.2em] file:text-xs"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={uploading || !file}
            className="inline-flex items-center gap-2 bg-gold text-primary-foreground px-5 py-2 text-[11px] uppercase tracking-[0.25em] hover:opacity-90 transition-smooth disabled:opacity-50"
          >
            <Upload size={12} /> {uploading ? "Nahrávám…" : "Nahrát"}
          </button>
        </div>
      </form>

      {photos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Zatím žádné týmové fotky.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {photos.map((p, i) => (
            <div key={p.id} className="border border-border">
              <div className="relative" style={{ aspectRatio: "4/5" }}>
                <img
                  src={p.image_url}
                  alt={p.caption_cs ?? ""}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-3 grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold">#{i + 1}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => move(p.id, -1)} disabled={i === 0} className="p-1.5 text-muted-foreground hover:text-gold disabled:opacity-30" aria-label="Nahoru">
                      <ArrowUp size={14} />
                    </button>
                    <button onClick={() => move(p.id, 1)} disabled={i === photos.length - 1} className="p-1.5 text-muted-foreground hover:text-gold disabled:opacity-30" aria-label="Dolů">
                      <ArrowDown size={14} />
                    </button>
                    <button onClick={() => remove(p)} className="p-1.5 text-muted-foreground hover:text-red-400" aria-label="Smazat">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div>
                  <FieldLabel>Popisek (CZ)</FieldLabel>
                  <input
                    value={p.caption_cs ?? ""}
                    onChange={(e) => updateLocal(p.id, { caption_cs: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <FieldLabel>Popisek (EN)</FieldLabel>
                  <input
                    value={p.caption_en ?? ""}
                    onChange={(e) => updateLocal(p.id, { caption_en: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <button
                  onClick={() => save(p)}
                  disabled={savingId === p.id}
                  className="inline-flex items-center justify-center gap-2 border border-gold text-gold px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] hover:bg-gold hover:text-primary-foreground transition-smooth disabled:opacity-50"
                >
                  <Save size={11} /> {savingId === p.id ? "Ukládám…" : "Uložit"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminSection>
  );
}
