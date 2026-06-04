
ALTER TABLE public.gallery_photos
  ADD COLUMN hero_slot smallint,
  ADD COLUMN featured_slot smallint,
  ADD COLUMN hero_order integer NOT NULL DEFAULT 0,
  ADD COLUMN featured_order integer NOT NULL DEFAULT 0;

ALTER TABLE public.gallery_photos
  ADD CONSTRAINT gallery_photos_hero_slot_range
    CHECK (hero_slot IS NULL OR hero_slot BETWEEN 1 AND 2);

ALTER TABLE public.gallery_photos
  ADD CONSTRAINT gallery_photos_featured_slot_range
    CHECK (featured_slot IS NULL OR featured_slot BETWEEN 1 AND 3);

UPDATE public.gallery_photos SET hero_slot = 1 WHERE is_hero = true AND hero_slot IS NULL;
UPDATE public.gallery_photos SET featured_slot = 1 WHERE is_featured = true AND featured_slot IS NULL;

CREATE INDEX IF NOT EXISTS gallery_photos_hero_slot_idx
  ON public.gallery_photos(hero_slot, hero_order) WHERE hero_slot IS NOT NULL;
CREATE INDEX IF NOT EXISTS gallery_photos_featured_slot_idx
  ON public.gallery_photos(featured_slot, featured_order) WHERE featured_slot IS NOT NULL;

CREATE TABLE public.gallery_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gallery_tags TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_tags TO authenticated;
GRANT ALL ON public.gallery_tags TO service_role;

ALTER TABLE public.gallery_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags"
  ON public.gallery_tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert tags"
  ON public.gallery_tags FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tags"
  ON public.gallery_tags FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tags"
  ON public.gallery_tags FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Seed from existing distinct tag values so user has a starting list
INSERT INTO public.gallery_tags (name)
SELECT DISTINCT tag FROM public.gallery_photos
WHERE tag IS NOT NULL AND tag <> ''
ON CONFLICT (name) DO NOTHING;
