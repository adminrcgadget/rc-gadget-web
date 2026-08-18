-- =========================================================
-- RUN THIS IN SUPABASE SQL EDITOR TO ALLOW ADMIN SAVES
-- (Since admin auth is handled via Next.js env credentials)
-- =========================================================

ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_section DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_section DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.features DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links DISABLE ROW LEVEL SECURITY;
