import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useMemo, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Lightbox } from "@/components/Lightbox";
import { AdminTeam } from "@/components/admin/AdminTeam";
import { AdminBilingualList } from "@/components/admin/AdminBilingualList";
import { AdminPageTexts } from "@/components/admin/AdminPageTexts";
import { AdminPricingPackages } from "@/components/admin/AdminPricingPackages";
import {
  Trash2,
  Upload,
  LogOut,
  ZoomIn,
  GripVertical,
  Plus,
  X,
  Sparkles,
  Star,
} from "lucide-react";

type AdminTab = "gallery" | "about" | "services" | "pricing";

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
  hero_slot: number | null;
  featured_slot: number | null;
  hero_order: number;
  featured_order: number;
};

type Tag = { id: string; name: string };

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — I&E Tile Services" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const HERO_SLOTS = [1, 2] as const;
const FEATURED_SLOTS = [1, 2, 3] as const;

function AdminPage() {
  const navigate = useNavigate();
  const { session, loading, isAdmin, user } = useAuth();
  const [tab, setTab] = useState<AdminTab>("gallery");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  // Upload form
  const [file, setFile] = useState<File | null>(null);
  const [titleCs, setTitleCs] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [tag, setTag] = useState("");
  const [ratio, setRatio] = useState("4/3");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tag management
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login", replace: true });
  }, [loading, session, navigate]);

  const fetchPhotos = useCallback(async () => {
    setLoadingPhotos(true);
    const { data } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (data) setPhotos(data as Photo[]);
    setLoadingPhotos(false);
  }, []);

  const fetchTags = useCallback(async () => {
    const { data } = await supabase
      .from("gallery_tags")
      .select("id,name")
      .order("name", { ascending: true });
    if (data) setTags(data as Tag[]);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchPhotos();
      fetchTags();
    }
  }, [isAdmin, fetchPhotos, fetchTags]);

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

      const tagValue = tag.trim() || null;
      const { error: insErr } = await supabase.from("gallery_photos").insert({
        title_cs: titleCs.trim(),
        title_en: titleEn.trim() || null,
        tag: tagValue,
        ratio,
        storage_path: path,
        image_url: pub.publicUrl,
        created_by: user!.id,
        sort_order: photos.length,
      });
      if (insErr) throw insErr;

      // Auto-register new tag if it's new
      if (tagValue && !tags.some((t) => t.name.toLowerCase() === tagValue.toLowerCase())) {
        await supabase.from("gallery_tags").insert({ name: tagValue });
        fetchTags();
      }

      setFile(null);
      setTitleCs("");
      setTitleEn("");
      setTag("");
      const fi = document.getElementById("file-input") as HTMLInputElement | null;
      if (fi) fi.value = "";
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

  const onAddTag = async (e: FormEvent) => {
    e.preventDefault();
    const name = newTag.trim();
    if (!name) return;
    if (tags.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      setNewTag("");
      return;
    }
    const { error } = await supabase.from("gallery_tags").insert({ name });
    if (error) alert(error.message);
    else {
      setNewTag("");
      fetchTags();
    }
  };

  const onDeleteTag = async (t: Tag) => {
    if (!confirm(`Smazat štítek „${t.name}"? Fotky si štítek ponechají.`)) return;
    const { error } = await supabase.from("gallery_tags").delete().eq("id", t.id);
    if (error) alert(error.message);
    else fetchTags();
  };

  const updatePhoto = async (
    id: string,
    patch: Partial<Pick<Photo, "hero_slot" | "featured_slot" | "hero_order" | "featured_order" | "tag">>,
  ) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    const { error } = await supabase.from("gallery_photos").update(patch).eq("id", id);
    if (error) {
      alert(error.message);
      fetchPhotos();
    }
  };

  const setHeroSlot = (p: Photo, slot: number | null) => {
    const patch: Partial<Photo> = { hero_slot: slot };
    if (slot) {
      // Append at end of new slot
      const tail = photos.filter((x) => x.hero_slot === slot).length;
      patch.hero_order = tail;
    }
    updatePhoto(p.id, patch);
  };

  const setFeaturedSlot = (p: Photo, slot: number | null) => {
    const patch: Partial<Photo> = { featured_slot: slot };
    if (slot) {
      const tail = photos.filter((x) => x.featured_slot === slot).length;
      patch.featured_order = tail;
    }
    updatePhoto(p.id, patch);
  };

  const setPhotoTag = (p: Photo, value: string) =>
    updatePhoto(p.id, { tag: value || null });

  const heroBuckets = useMemo(() => {
    const map: Record<number, Photo[]> = { 1: [], 2: [] };
    photos.forEach((p) => {
      if (p.hero_slot === 1 || p.hero_slot === 2) map[p.hero_slot].push(p);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.hero_order - b.hero_order));
    return map;
  }, [photos]);

  const featuredBuckets = useMemo(() => {
    const map: Record<number, Photo[]> = { 1: [], 2: [], 3: [] };
    photos.forEach((p) => {
      if (p.featured_slot && map[p.featured_slot]) map[p.featured_slot].push(p);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.featured_order - b.featured_order));
    return map;
  }, [photos]);

  const reorderInSlot = async (
    kind: "hero" | "featured",
    slot: number,
    fromId: string,
    toId: string,
  ) => {
    const bucket =
      kind === "hero" ? [...heroBuckets[slot]] : [...featuredBuckets[slot]];
    const fromIdx = bucket.findIndex((p) => p.id === fromId);
    const toIdx = bucket.findIndex((p) => p.id === toId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    const [moved] = bucket.splice(fromIdx, 1);
    bucket.splice(toIdx, 0, moved);

    // Optimistic update of local state
    setPhotos((prev) =>
      prev.map((p) => {
        const idx = bucket.findIndex((x) => x.id === p.id);
        if (idx === -1) return p;
        return kind === "hero"
          ? { ...p, hero_order: idx }
          : { ...p, featured_order: idx };
      }),
    );

    // Persist
    await Promise.all(
      bucket.map((p, idx) => {
        const update =
          kind === "hero" ? { hero_order: idx } : { featured_order: idx };
        return supabase.from("gallery_photos").update(update).eq("id", p.id);
      }),
    );
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
        <p className="mt-4 text-muted-foreground">Tento účet nemá administrátorskou roli.</p>
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
          <h1 className="mt-3 font-display text-5xl">Admin</h1>
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

      {/* HERO + FEATURED placement boards */}
      <div className="mt-12 grid gap-12">
        <PlacementBoard
          title="Hero sloty (úvodní blok)"
          icon={<Sparkles size={16} className="text-gold" />}
          slots={HERO_SLOTS}
          buckets={heroBuckets}
          onReorder={(slot, from, to) => reorderInSlot("hero", slot, from, to)}
          onRemove={(p) => setHeroSlot(p, null)}
          onZoom={setLightbox}
        />
        <PlacementBoard
          title="Vybrané realizace"
          icon={<Star size={16} className="text-gold" />}
          slots={FEATURED_SLOTS}
          buckets={featuredBuckets}
          onReorder={(slot, from, to) => reorderInSlot("featured", slot, from, to)}
          onRemove={(p) => setFeaturedSlot(p, null)}
          onZoom={setLightbox}
        />
      </div>

      {/* Tags */}
      <div className="mt-16 border border-border p-8">
        <h2 className="font-display text-2xl">Štítky / kategorie</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Vlastní štítky se nabízejí při nahrávání i u jednotlivých fotek níže.
        </p>
        <form onSubmit={onAddTag} className="mt-4 flex gap-2">
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Nový štítek (např. Industriální)"
            className="flex-1 bg-transparent border border-border focus:border-gold outline-none px-4 py-2.5"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-gold text-primary-foreground px-5 py-2.5 text-xs uppercase tracking-[0.25em] hover:opacity-90 transition-smooth"
          >
            <Plus size={14} /> Přidat
          </button>
        </form>
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <span className="text-xs text-muted-foreground">Zatím žádné štítky.</span>
          ) : (
            tags.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-xs"
              >
                {t.name}
                <button
                  onClick={() => onDeleteTag(t)}
                  className="text-muted-foreground hover:text-red-400"
                  aria-label={`Smazat ${t.name}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
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
            list="tags-list"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Vyberte nebo napište nový"
            className="w-full bg-transparent border border-border focus:border-gold outline-none px-4 py-3"
          />
          <datalist id="tags-list">
            {tags.map((t) => (
              <option key={t.id} value={t.name} />
            ))}
          </datalist>
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
        <h2 className="font-display text-3xl">Všechny fotky ({photos.length})</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Přiřaďte fotku do Hero / Vybrané sloupce. Více fotek v jednom slotu se na webu zobrazí jako carousel s šipkami.
        </p>

        {loadingPhotos ? (
          <p className="mt-8 text-muted-foreground">Načítání…</p>
        ) : photos.length === 0 ? (
          <p className="mt-8 text-muted-foreground">Zatím žádné fotky. Nahrajte první výše.</p>
        ) : (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((p) => (
              <div key={p.id} className="border border-border group">
                <button
                  type="button"
                  onClick={() => setLightbox(p)}
                  className="relative overflow-hidden w-full block cursor-zoom-in"
                  style={{ aspectRatio: p.ratio }}
                  aria-label={`Zvětšit ${p.title_cs}`}
                >
                  <img
                    src={p.image_url}
                    alt={p.title_cs}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-smooth flex items-center justify-center">
                    <ZoomIn
                      size={32}
                      className="text-gold opacity-0 group-hover:opacity-100 transition-smooth"
                    />
                  </div>
                  {(p.hero_slot || p.featured_slot) && (
                    <div className="absolute top-2 left-2 flex gap-1">
                      {p.hero_slot && (
                        <span className="bg-gold text-primary-foreground text-[9px] uppercase tracking-[0.2em] px-2 py-1 inline-flex items-center gap-1">
                          <Sparkles size={10} /> Hero {p.hero_slot}
                        </span>
                      )}
                      {p.featured_slot && (
                        <span className="bg-gold text-primary-foreground text-[9px] uppercase tracking-[0.2em] px-2 py-1 inline-flex items-center gap-1">
                          <Star size={10} /> Vybrané {p.featured_slot}
                        </span>
                      )}
                    </div>
                  )}
                </button>
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-display text-lg truncate">{p.title_cs}</div>
                  </div>
                  <button
                    onClick={() => onDelete(p)}
                    className="text-muted-foreground hover:text-red-400 transition-smooth p-2"
                    aria-label="Smazat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      Hero slot
                    </span>
                    <select
                      value={p.hero_slot ?? ""}
                      onChange={(e) =>
                        setHeroSlot(p, e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full bg-background border border-border focus:border-gold outline-none px-2 py-2 text-sm"
                    >
                      <option value="">—</option>
                      {HERO_SLOTS.map((s) => (
                        <option key={s} value={s}>
                          Slot {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      Vybrané slot
                    </span>
                    <select
                      value={p.featured_slot ?? ""}
                      onChange={(e) =>
                        setFeaturedSlot(p, e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full bg-background border border-border focus:border-gold outline-none px-2 py-2 text-sm"
                    >
                      <option value="">—</option>
                      {FEATURED_SLOTS.map((s) => (
                        <option key={s} value={s}>
                          Slot {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block col-span-2">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      Štítek
                    </span>
                    <input
                      list="tags-list"
                      value={p.tag ?? ""}
                      onChange={(e) => setPhotoTag(p, e.target.value)}
                      placeholder="—"
                      className="w-full bg-transparent border border-border focus:border-gold outline-none px-2 py-2 text-sm"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <Lightbox
          src={lightbox.image_url}
          alt={lightbox.title_cs}
          caption={lightbox.title_cs}
          tag={lightbox.tag}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}

type PlacementBoardProps = {
  title: string;
  icon: React.ReactNode;
  slots: readonly number[];
  buckets: Record<number, Photo[]>;
  onReorder: (slot: number, fromId: string, toId: string) => void;
  onRemove: (p: Photo) => void;
  onZoom: (p: Photo) => void;
};

function PlacementBoard({
  title,
  icon,
  slots,
  buckets,
  onReorder,
  onRemove,
  onZoom,
}: PlacementBoardProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  return (
    <div className="border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="font-display text-2xl">{title}</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-6">
        Přetáhněte fotky a změňte pořadí v rámci slotu. Více fotek v jednom slotu se zobrazí jako carousel.
      </p>
      <div
        className={`grid gap-4 ${
          slots.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
        }`}
      >
        {slots.map((slot) => {
          const items = buckets[slot] ?? [];
          return (
            <div
              key={slot}
              className="border border-dashed border-border/70 p-3 bg-card/30 min-h-[160px]"
            >
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold mb-3">
                Slot {slot} · {items.length} {items.length === 1 ? "fotka" : "fotek"}
              </div>
              {items.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  Prázdné — přiřaďte fotku níže
                </p>
              ) : (
                <div className="grid gap-2">
                  {items.map((p) => (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={() => setDragId(p.id)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragId && dragId !== p.id) setOverId(p.id);
                      }}
                      onDragLeave={() => {
                        if (overId === p.id) setOverId(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (dragId && dragId !== p.id) onReorder(slot, dragId, p.id);
                        setDragId(null);
                        setOverId(null);
                      }}
                      onDragEnd={() => {
                        setDragId(null);
                        setOverId(null);
                      }}
                      className={`flex items-center gap-3 border bg-background p-2 cursor-grab active:cursor-grabbing transition-smooth ${
                        overId === p.id ? "border-gold" : "border-border"
                      } ${dragId === p.id ? "opacity-50" : ""}`}
                    >
                      <GripVertical size={14} className="text-muted-foreground shrink-0" />
                      <button
                        type="button"
                        onClick={() => onZoom(p)}
                        className="w-14 h-14 shrink-0 overflow-hidden bg-muted cursor-zoom-in"
                        aria-label={`Zvětšit ${p.title_cs}`}
                      >
                        <img
                          src={p.image_url}
                          alt={p.title_cs}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-display truncate">{p.title_cs}</div>
                        {p.tag && (
                          <div className="text-[9px] uppercase tracking-[0.2em] text-gold">
                            {p.tag}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(p)}
                        className="text-muted-foreground hover:text-red-400 p-1"
                        aria-label="Odebrat ze slotu"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
