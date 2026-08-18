-- =========================================================
-- RC GADGETS — COMPLETE DATABASE SCHEMA & SEED SCRIPT
-- Integrated with Cloudinary CDN & Supabase PostgreSQL
-- Safe to run and re-run without errors!
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL DEFAULT 'RC Gadgets',
    tagline TEXT DEFAULT 'Your World of Remote Control',
    description TEXT DEFAULT 'Built for passion. Driven by performance. RC Gadgets – where excitement begins!',
    phone TEXT DEFAULT '75 101 101 55',
    email TEXT DEFAULT 'rcgadgetsstore@gmail.com',
    address TEXT DEFAULT 'Parambilangadi',
    city TEXT DEFAULT 'Kottakkal',
    state TEXT DEFAULT 'Kerala',
    country TEXT DEFAULT 'India',
    logo_url TEXT DEFAULT 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045184/rc-gadgets/assets/logo.webp',
    favicon_url TEXT DEFAULT 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045184/rc-gadgets/assets/logo.webp',
    instagram_url TEXT DEFAULT 'https://www.instagram.com/rc_gadgetsstore/',
    facebook_url TEXT DEFAULT 'https://www.facebook.com/share/19FeP3z6KV/',
    youtube_url TEXT DEFAULT 'https://www.youtube.com',
    whatsapp_number TEXT DEFAULT '+917510110155',
    copyright_text TEXT DEFAULT '© 2026 RC Gadgets. All Rights Reserved.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. NAVIGATION ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. HERO SECTION TABLE
CREATE TABLE IF NOT EXISTS public.hero_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eyebrow TEXT,
    heading_line_1 TEXT NOT NULL DEFAULT 'YOUR WORLD OF',
    heading_line_2 TEXT DEFAULT 'REMOTE',
    heading_line_3 TEXT DEFAULT 'CONTROL',
    description TEXT DEFAULT 'Premium RC Cars, Planes, Ships, Excavators and all RC Gadgets.',
    highlighted_text TEXT DEFAULT 'BUILT FOR PASSION. DRIVEN BY PERFORMANCE.',
    primary_button_text TEXT DEFAULT 'LEARN MORE',
    primary_button_url TEXT DEFAULT '#about',
    secondary_button_text TEXT DEFAULT 'CONTACT US',
    secondary_button_url TEXT DEFAULT '#contact',
    background_image_url TEXT DEFAULT 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045181/rc-gadgets/assets/hero-main-banner.webp',
    foreground_image_url TEXT DEFAULT 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045183/rc-gadgets/assets/hero-truck.webp',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CATEGORIES / RC WORLD TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_description TEXT,
    icon_url TEXT,
    image_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'COMING SOON',
    subtitle TEXT DEFAULT 'INTO NEW IN KOTTAKKAL',
    description TEXT DEFAULT 'FIRST IN MALAPPURAM',
    image_url TEXT DEFAULT 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045173/rc-gadgets/assets/coming-soon-composite.webp',
    mobile_image_url TEXT DEFAULT 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045173/rc-gadgets/assets/coming-soon-composite.webp',
    desktop_image_url TEXT DEFAULT 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045173/rc-gadgets/assets/coming-soon-composite.webp',
    button_text TEXT DEFAULT 'Get In Touch',
    button_url TEXT DEFAULT '#contact',
    position TEXT DEFAULT 'featured',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. ABOUT SECTION TABLE
CREATE TABLE IF NOT EXISTS public.about_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eyebrow TEXT DEFAULT 'ABOUT RC GADGETS',
    heading TEXT NOT NULL DEFAULT 'MORE THAN A STORE, IT''S AN EXPERIENCE!',
    description TEXT NOT NULL DEFAULT 'RC Gadgets is your ultimate destination for everything remote control. From high-performance RC cars to precision planes, powerful excavators to premium accessories, we bring the best of RC world to Kottakkal. Get ready for a whole new experience!',
    image_url TEXT,
    button_text TEXT DEFAULT 'READ MORE',
    button_url TEXT DEFAULT '#contact',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. FEATURES / WHY CHOOSE US TABLE
CREATE TABLE IF NOT EXISTS public.features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    button_text TEXT DEFAULT 'Learn More',
    button_url TEXT DEFAULT '#contact',
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =========================================================
-- 1. DISABLE RLS (Admin authentication is handled securely via Next.js middleware and .env credentials)
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_section DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_section DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.features DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links DISABLE ROW LEVEL SECURITY;

-- =========================================================
-- SEED INITIAL DATA (With Cloudinary CDN URLs)
-- =========================================================

-- Seed Site Settings (Single Record)
INSERT INTO public.site_settings (
    id, business_name, tagline, description, phone, email, address, city, state, country,
    logo_url, favicon_url, instagram_url, facebook_url, youtube_url, whatsapp_number, copyright_text
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'RC Gadgets',
    'Your World of Remote Control',
    'Built for passion. Driven by performance. RC Gadgets – where excitement begins!',
    '75 101 101 55',
    'rcgadgetsstore@gmail.com',
    'Parambilangadi',
    'Kottakkal',
    'Kerala',
    'India',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045184/rc-gadgets/assets/logo.webp',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045184/rc-gadgets/assets/logo.webp',
    'https://www.instagram.com/rc_gadgetsstore/',
    'https://www.facebook.com/share/19FeP3z6KV/',
    'https://www.youtube.com',
    '+917510110155',
    '© 2026 RC Gadgets. All Rights Reserved.'
) ON CONFLICT (id) DO UPDATE SET
    logo_url = EXCLUDED.logo_url,
    tagline = EXCLUDED.tagline,
    copyright_text = EXCLUDED.copyright_text;

-- Seed Navigation Items
INSERT INTO public.navigation_items (label, href, sort_order, is_visible) VALUES
('HOME', '#hero', 1, true),
('ABOUT', '#about', 2, true),
('OUR WORLD', '#our-world', 3, true),
('EXPERIENCE', '#experience', 4, true),
('CONTACT', '#contact', 5, true)
ON CONFLICT DO NOTHING;

-- Seed Hero Section
INSERT INTO public.hero_section (
    id, eyebrow, heading_line_1, heading_line_2, heading_line_3,
    description, highlighted_text, primary_button_text, primary_button_url,
    secondary_button_text, secondary_button_url, background_image_url,
    foreground_image_url, is_active
) VALUES (
    'b0000000-0000-0000-0000-000000000001',
    NULL,
    'YOUR WORLD OF',
    'REMOTE',
    'CONTROL',
    'Premium RC Cars, Planes, Ships, Excavators and all RC Gadgets.',
    'BUILT FOR PASSION. DRIVEN BY PERFORMANCE.',
    'LEARN MORE',
    '#about',
    'CONTACT US',
    '#contact',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045181/rc-gadgets/assets/hero-main-banner.webp',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045183/rc-gadgets/assets/hero-truck.webp',
    true
) ON CONFLICT (id) DO UPDATE SET
    background_image_url = EXCLUDED.background_image_url,
    foreground_image_url = EXCLUDED.foreground_image_url,
    primary_button_text = EXCLUDED.primary_button_text,
    secondary_button_text = EXCLUDED.secondary_button_text;

-- Seed Categories
INSERT INTO public.categories (name, short_description, sort_order, image_url, is_active) VALUES
('RC CARS', 'High-speed brushless buggies & scale 4WD racers.', 1, 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045166/rc-gadgets/assets/cat-car.webp', true),
('RC PLANES', 'Aerobatic aircraft & precision scale jets.', 2, 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045169/rc-gadgets/assets/cat-plane.webp', true),
('RC SHIPS', 'Brushless speed boats & scale battleships.', 3, 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045170/rc-gadgets/assets/cat-ship.webp', true),
('RC EXCAVATORS', 'Heavy-duty full-metal hydraulic diggers.', 4, 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045167/rc-gadgets/assets/cat-excavator.webp', true),
('AND ALL RC GADGETS', 'Pro-level radio systems, telemetry & accessories.', 5, 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045168/rc-gadgets/assets/cat-gadget.webp', true)
ON CONFLICT DO NOTHING;

-- Seed Banner
INSERT INTO public.banners (
    title, subtitle, description, image_url, desktop_image_url, mobile_image_url,
    button_text, button_url, position, is_active, sort_order
) VALUES (
    'COMING SOON',
    'INTO NEW IN KOTTAKKAL',
    'FIRST IN MALAPPURAM',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045173/rc-gadgets/assets/coming-soon-composite.webp',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045173/rc-gadgets/assets/coming-soon-composite.webp',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045173/rc-gadgets/assets/coming-soon-composite.webp',
    'Get In Touch',
    '#contact',
    'featured',
    true,
    1
) ON CONFLICT DO NOTHING;

-- Seed About Section
INSERT INTO public.about_section (
    id, eyebrow, heading, description, image_url, button_text, button_url, is_active
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'ABOUT RC GADGETS',
    'MORE THAN A STORE, IT''S AN EXPERIENCE!',
    'RC Gadgets is your ultimate destination for everything remote control. From high-performance RC cars to precision planes, powerful excavators to premium accessories, we bring the best of RC world to Kottakkal. Get ready for a whole new experience!',
    NULL,
    'READ MORE',
    '#contact',
    true
) ON CONFLICT (id) DO UPDATE SET
    heading = EXCLUDED.heading,
    description = EXCLUDED.description;

-- Seed Features
INSERT INTO public.features (title, description, sort_order, is_active) VALUES
('PREMIUM QUALITY', 'Carefully selected products for the best performance.', 1, true),
('TRUSTED BRANDS', 'We work with the world''s leading RC brands.', 2, true),
('EXPERT SUPPORT', 'Expert guidance whenever you need it.', 3, true),
('FAST & SAFE DELIVERY', 'Secure packaging and reliable delivery.', 4, true)
ON CONFLICT DO NOTHING;

-- Seed Experiences
INSERT INTO public.experiences (title, subtitle, description, image_url, button_text, button_url, sort_order, is_active) VALUES
('RC CAR TRACK', 'FOR SPEED LOVERS', 'Indoor asphalt racing circuit with high-grip banked curves designed for high-speed touring and drift battles.', 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045187/rc-gadgets/assets/rc-car-track.webp', 'Learn More', '#contact', 1, true),
('RC ADVENTURE TRACK', 'BUILT FOR EXTREME FUN', 'Extreme rock crawling trail with timber bridges, boulders, and suspension obstacle zones.', 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045186/rc-gadgets/assets/rc-adventure-track.webp', 'Learn More', '#contact', 2, true)
ON CONFLICT DO NOTHING;

-- Seed Social Links
INSERT INTO public.social_links (platform, label, url, sort_order, is_active) VALUES
('Instagram', '@rc_gadgetsstore', 'https://www.instagram.com/rc_gadgetsstore/', 1, true),
('Facebook', 'RC Gadgets Store', 'https://www.facebook.com/share/19FeP3z6KV/', 2, true),
('YouTube', 'RC Gadgets Official', 'https://www.youtube.com', 3, true)
ON CONFLICT DO NOTHING;
