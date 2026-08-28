-- =========================================================
-- CREATE PRODUCTS TABLE, DISABLE RLS & INSERT 6 PRODUCTS
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- =========================================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category_name TEXT NOT NULL DEFAULT 'RC Cars',
    brand_name TEXT DEFAULT 'RC GADGETS',
    price NUMERIC NOT NULL DEFAULT 0,
    original_price NUMERIC,
    rating NUMERIC DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    badge TEXT,
    image_url TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    description TEXT,
    stock_quantity INT DEFAULT 10,
    is_bestseller BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    is_top_rated BOOLEAN DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Safe column migrations
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 1. DISABLE ROW LEVEL SECURITY (Allows Admin Panel & Web to read/write products)
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- 2. INSERT 6 CONNECTED PRODUCTS (Directly to Supabase Database)
INSERT INTO public.products (
    title, category_name, brand_name, price, original_price, rating, reviews_count,
    badge, image_url, gallery_images, video_url, description, stock_quantity,
    is_bestseller, is_new_arrival, is_top_rated, is_active, sort_order
) VALUES
(
    'Traxxas X-Maxx 8S 4WD Brushless Monster Truck',
    'RC Cars',
    'Traxxas',
    79999,
    89999,
    4.9,
    128,
    'HOT',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787306232/rc-gadgets/products/htl9oqyfsxiz3kgyjjtj.png',
    '["https://res.cloudinary.com/r28lk4ms/image/upload/v1787306232/rc-gadgets/products/htl9oqyfsxiz3kgyjjtj.png", "https://res.cloudinary.com/r28lk4ms/image/upload/v1787306118/rc-gadgets/products/hwrzospucx27bicsvjgz.png"]'::jsonb,
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'Unstoppable 8S power, mammoth size, and award-winning durability.',
    5,
    true,
    false,
    true,
    true,
    1
),
(
    'Traxxas Bandit VXL Pro Buggy',
    'RC Cars',
    'Traxxas',
    34990,
    39000,
    4.9,
    96,
    'NEW',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787306118/rc-gadgets/products/hwrzospucx27bicsvjgz.png',
    '["https://res.cloudinary.com/r28lk4ms/image/upload/v1787306118/rc-gadgets/products/hwrzospucx27bicsvjgz.png"]'::jsonb,
    NULL,
    'Extreme speed 70+ mph brushless power with high-downforce rear wing and Velineon system.',
    8,
    true,
    true,
    true,
    true,
    2
),
(
    'FMS Mustang GT Touring Car',
    'RC Cars',
    'FMS',
    32999,
    38000,
    4.8,
    74,
    'POPULAR',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787306020/rc-gadgets/products/qgncgcvcx8vts9y3jjwb.png',
    '["https://res.cloudinary.com/r28lk4ms/image/upload/v1787306020/rc-gadgets/products/qgncgcvcx8vts9y3jjwb.png"]'::jsonb,
    NULL,
    'Scale detail, functional aerodynamic body, high-speed brushless power, and drift setup.',
    4,
    true,
    false,
    true,
    true,
    3
),
(
    'FMS 1400mm P-51D Mustang Plane',
    'RC Planes',
    'FMS',
    29999,
    34500,
    4.8,
    89,
    'SALE',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787305830/rc-gadgets/products/pbri8qp6wbkyanadiwwk.png',
    '["https://res.cloudinary.com/r28lk4ms/image/upload/v1787305830/rc-gadgets/products/pbri8qp6wbkyanadiwwk.png"]'::jsonb,
    NULL,
    'Scale detail, functional flaps, retractable landing gear, and high-speed brushless power.',
    12,
    true,
    false,
    false,
    true,
    4
),
(
    'Volantex Vector SR80 RC Boat',
    'RC Boats',
    'Volantex',
    23999,
    27999,
    4.9,
    64,
    'HOT',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787305712/rc-gadgets/products/wmbxeacvbct7klyt6qa5.png',
    '["https://res.cloudinary.com/r28lk4ms/image/upload/v1787305712/rc-gadgets/products/wmbxeacvbct7klyt6qa5.png"]'::jsonb,
    NULL,
    'Auto-roll back function, water-cooled brushless motor hitting speeds over 70 km/h.',
    6,
    true,
    false,
    true,
    true,
    5
),
(
    'FlySky FS-GT5 Transmitter',
    'Accessories',
    'FlySky',
    6499,
    7999,
    4.8,
    112,
    'BEST',
    'https://res.cloudinary.com/r28lk4ms/image/upload/v1787305322/rc-gadgets/products/vvw23p2rnmr7jefw5n8m.png',
    '["https://res.cloudinary.com/r28lk4ms/image/upload/v1787305322/rc-gadgets/products/vvw23p2rnmr7jefw5n8m.png"]'::jsonb,
    NULL,
    '6-channel ultra-fast AFHDS 2A protocol with built-in gyro receiver (FS-BS6).',
    20,
    true,
    false,
    true,
    true,
    6
);
