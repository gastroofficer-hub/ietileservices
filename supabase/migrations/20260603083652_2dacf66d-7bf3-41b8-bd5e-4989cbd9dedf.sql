ALTER TABLE public.gallery_photos
  ADD COLUMN IF NOT EXISTS is_hero boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_gallery_photos_hero ON public.gallery_photos (is_hero) WHERE is_hero;
CREATE INDEX IF NOT EXISTS idx_gallery_photos_featured ON public.gallery_photos (is_featured) WHERE is_featured;