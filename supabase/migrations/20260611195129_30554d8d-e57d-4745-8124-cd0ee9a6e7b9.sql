
-- ============== TEAM PHOTOS (mini-galerie v sekci O nás) ==============
CREATE TABLE public.team_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  storage_path text NOT NULL,
  caption_cs text,
  caption_en text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_photos TO authenticated;
GRANT ALL ON public.team_photos TO service_role;
ALTER TABLE public.team_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view team photos" ON public.team_photos FOR SELECT USING (true);
CREATE POLICY "Admins manage team photos insert" ON public.team_photos FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage team photos update" ON public.team_photos FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage team photos delete" ON public.team_photos FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ============== SERVICES ==============
CREATE TABLE public.service_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_cs text NOT NULL,
  title_en text,
  desc_cs text,
  desc_en text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_items TO authenticated;
GRANT ALL ON public.service_items TO service_role;
ALTER TABLE public.service_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view services" ON public.service_items FOR SELECT USING (true);
CREATE POLICY "Admins insert services" ON public.service_items FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update services" ON public.service_items FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete services" ON public.service_items FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ============== ABOUT VALUES ==============
CREATE TABLE public.about_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_cs text NOT NULL,
  title_en text,
  desc_cs text,
  desc_en text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.about_values TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.about_values TO authenticated;
GRANT ALL ON public.about_values TO service_role;
ALTER TABLE public.about_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view about values" ON public.about_values FOR SELECT USING (true);
CREATE POLICY "Admins insert about values" ON public.about_values FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update about values" ON public.about_values FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete about values" ON public.about_values FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ============== ABOUT BODY PARAGRAPHS ==============
CREATE TABLE public.about_paragraphs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  body_cs text NOT NULL,
  body_en text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.about_paragraphs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.about_paragraphs TO authenticated;
GRANT ALL ON public.about_paragraphs TO service_role;
ALTER TABLE public.about_paragraphs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view about paragraphs" ON public.about_paragraphs FOR SELECT USING (true);
CREATE POLICY "Admins insert about paragraphs" ON public.about_paragraphs FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update about paragraphs" ON public.about_paragraphs FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete about paragraphs" ON public.about_paragraphs FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ============== PRICING PACKAGES ==============
CREATE TABLE public.pricing_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_cs text NOT NULL,
  name_en text,
  price_cs text,
  price_en text,
  unit_cs text,
  unit_en text,
  desc_cs text,
  desc_en text,
  features_cs text[] NOT NULL DEFAULT '{}',
  features_en text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pricing_packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pricing_packages TO authenticated;
GRANT ALL ON public.pricing_packages TO service_role;
ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view pricing packages" ON public.pricing_packages FOR SELECT USING (true);
CREATE POLICY "Admins insert pricing packages" ON public.pricing_packages FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update pricing packages" ON public.pricing_packages FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete pricing packages" ON public.pricing_packages FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ============== PRICING LINE ITEMS ==============
CREATE TABLE public.pricing_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_cs text NOT NULL,
  title_en text,
  price_cs text,
  price_en text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pricing_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pricing_items TO authenticated;
GRANT ALL ON public.pricing_items TO service_role;
ALTER TABLE public.pricing_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view pricing items" ON public.pricing_items FOR SELECT USING (true);
CREATE POLICY "Admins insert pricing items" ON public.pricing_items FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update pricing items" ON public.pricing_items FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete pricing items" ON public.pricing_items FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ============== PAGE TEXTS (titles, leads) ==============
CREATE TABLE public.page_texts (
  key text PRIMARY KEY,
  value_cs text,
  value_en text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.page_texts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_texts TO authenticated;
GRANT ALL ON public.page_texts TO service_role;
ALTER TABLE public.page_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view page texts" ON public.page_texts FOR SELECT USING (true);
CREATE POLICY "Admins insert page texts" ON public.page_texts FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update page texts" ON public.page_texts FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete page texts" ON public.page_texts FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ============== Storage policies for "gallery" bucket: allow team/ subfolder via existing admin policies (already broad). ==============
-- (gallery bucket is public — uploads handled by existing admin policies on storage.objects)
