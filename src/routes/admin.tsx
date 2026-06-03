import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trash2, Upload, LogOut, Star, Sparkles } from "lucide-react";

type Photo = {
  id: string;
  title_cs: string;
  title_en: string | null;
  tag: string | null;
  ratio: string;
  storage_path: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  is_hero: boolean;
  is_featured: boolean;
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — I&E Tile Services" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { session, loading, isAdmin, user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  // Upload form
  const [file, setFile] = useState<File | null>(null);
  const [titleCs, setTitleCs] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [tag, setTag] = useState("");
  const [ratio, setRatio] = useState("4/3");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login", replace: true });
  }, [loading, session, navigate]);

  const fetchPhotos = useCallback(async () => {
    setLoadingPhotos(true);
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (!error && data) setPhotos(data as Photo[]);
    setLoadingPhotos(false);
  }, []);

  useEffect(() => {
    if (isAdmin) fetchPhotos();
  }, [isAdmin, fetchPhotos]);

  const onUpload = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!file || !titleCs.trim()) {
      setError("Vyberte soubor a vyplňte název.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user!.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("gallery")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);

      const { error: insErr } = await supabase.from("gallery_photos").insert({
        title_cs: titleCs.trim(),
        title_en: titleEn.trim() || null,
        tag: tag.trim() || null,
        ratio,
        storage_path: path,
        image_url: pub.publicUrl,
        created_by: user!.id,
        sort_order: photos.length,
      });
      if (insErr) throw insErr;

      setFile(null);
      setTitleCs("");
      setTitleEn("");
      setTag("");
      (document.getElementById("file-input") as HTMLInputElement | null)?.value &&
        ((document.getElementById("file-input") as HTMLInputElement).value = "");
      await fetchPhotos();
    } catch (err: any) {
      setError(err?.message ?? "Nahrání selhalo");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (p: Photo) => {
    if (!confirm(`Smazat „${p.title_cs}"?`)) return;
    await supabase.storage.from("gallery").remove([p.storage_path]);
    await supabase.from("gallery_photos").delete().eq("id", p.id);
    await fetchPhotos();
  };

  const togglePlacement = async (p: Photo, field: "is_hero" | "is_featured") => {
    const next = !p[field];
    setPhotos((prev) => prev.map((x) => (x.id === p.id ? { ...x, [field]: next } : x)));
    const update = field === "is_hero" ? { is_hero: next } : { is_featured: next };
    const { error } = await supabase.from("gallery_photos").update(update).eq("id", p.id);
    if (error) {
      setPhotos((prev) => prev.map((x) => (x.id === p.id ? { ...x, [field]: !next } : x)));
      alert(error.message);
    }
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  if (loading) {
    return <section className="container-luxe py-32 text-center text-muted-foreground">Načítání…</section>;
  }

  if (!session) return null;

  if (!isAdmin) {
    return (
      <section className="container-luxe py-32 text-center">
        <h1 className="font-display text-4xl">Nemáte oprávnění</h1>
        <p className="mt-4 text-muted-foreground">
          Tento účet nemá administrátorskou roli.
        </p>
        <button
          onClick={onLogout}
          className="mt-8 border border-gold text-gold px-6 py-3 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-primary-foreground transition-smooth"
        >
          Odhlásit se
        </button>
      </section>
    );
  }

  return (
    <section className="container-luxe py-20">
      <div className="flex items-start justify-between flex-wrap gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold">Admin</div>
          <h1 className="mt-3 font-display text-5xl">Správa galerie</h1>
          <p className="mt-3 text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/gallery"
            className="border border-border text-foreground px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:border-gold transition-smooth"
          >
            Galerie
          </Link>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 border border-border text-muted-foreground hover:text-gold hover:border-gold px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition-smooth"
          >
            <LogOut size={14} /> Odhlásit
          </button>
        </div>
      </div>

      {/* Upload form */}
      <form
        onSubmit={onUpload}
        className="mt-12 border border-border p-8 grid gap-5 lg:grid-cols-2"
      >
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl">Nahrát novou fotku</h2>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Název (CZ) *
          </label>
          <input
            value={titleCs}
            onChange={(e) => setTitleCs(e.target.value)}
            className="w-full bg-transparent border border-border focus:border-gold outline-none px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Title (EN)
          </label>
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="w-full bg-transparent border border-border focus:border-gold outline-none px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Štítek / kategorie
          </label>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Mramorové, Minimalistické…"
            className="w-full bg-transparent border border-border focus:border-gold outline-none px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Poměr stran
          </label>
          <select
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            className="w-full bg-background border border-border focus:border-gold outline-none px-4 py-3"
          >
            <option value="4/3">4 / 3 (klasika)</option>
            <option value="4/5">4 / 5 (výška)</option>
            <option value="1/1">1 / 1 (čtverec)</option>
            <option value="16/9">16 / 9 (širokoúhlé)</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Soubor *
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border file:border-gold file:bg-transparent file:text-gold file:uppercase file:tracking-[0.2em] file:text-xs"
          />
        </div>

        {error && <div className="lg:col-span-2 text-sm text-red-400">{error}</div>}

        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-gold text-primary-foreground px-8 py-3 text-xs uppercase tracking-[0.25em] hover:opacity-90 transition-smooth disabled:opacity-50"
          >
            <Upload size={14} /> {uploading ? "Nahrávám…" : "Nahrát"}
          </button>
        </div>
      </form>

      {/* Photo list */}
      <div className="mt-16">
        <h2 className="font-display text-3xl">Fotky v galerii ({photos.length})</h2>

        {loadingPhotos ? (
          <p className="mt-8 text-muted-foreground">Načítání…</p>
        ) : photos.length === 0 ? (
          <p className="mt-8 text-muted-foreground">Zatím žádné fotky. Nahrajte první výše.</p>
        ) : (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((p) => (
              <div key={p.id} className="border border-border group">
                <div className="relative overflow-hidden" style={{ aspectRatio: p.ratio }}>
                  <img
                    src={p.image_url}
                    alt={p.title_cs}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-display text-lg truncate">{p.title_cs}</div>
                    {p.tag && (
                      <div className="text-[10px] uppercase tracking-[0.25em] text-gold mt-1">
                        {p.tag}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onDelete(p)}
                    className="text-muted-foreground hover:text-red-400 transition-smooth p-2"
                    aria-label="Smazat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
