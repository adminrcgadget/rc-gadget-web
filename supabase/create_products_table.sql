-- =========================================================
-- CREATE PRODUCTS TABLE & DISABLE RLS
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

-- Disable Row Level Security so Admin Dashboard can insert/update/delete
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Seed Initial Products (Safe to run without duplicates)
INSERT INTO public.products (
    title, category_name, brand_name, price, original_price, rating, reviews_count,
    badge, image_url, description, stock_quantity, is_bestseller, is_new_arrival, is_top_rated, is_active, sort_order
) VALUES
('Traxxas X-Maxx 8S 4WD Brushless Monster Truck', 'RC Cars', 'Traxxas', 79999, 89999, 4.9, 128, 'HOT', 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045166/rc-gadgets/assets/cat-car.webp', 'Unstoppable 8S power, mammoth size, and award-winning durability.', 5, true, false, true, true, 1),
('DJI Mini 4 Pro Drone with RC-N2 Controller', 'RC Drones', 'DJI', 84990, 92000, 4.9, 96, 'NEW', NULL, 'Omnidirectional obstacle sensing, 4K/60fps HDR video, and 34-min flight time.', 8, true, true, true, true, 2),
('FMS 1400mm P-51D Mustang V8 RC Plane', 'RC Planes', 'FMS', 32999, 38000, 4.8, 74, 'POPULAR', 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045169/rc-gadgets/assets/cat-plane.webp', 'Scale detail, functional flaps, retractable landing gear, and high-speed brushless power.', 4, true, false, true, true, 3),
('Traxxas Rustler 4x4 VXL Brushless RC Car', 'RC Cars', 'Traxxas', 29999, 34500, 4.8, 89, 'SALE', 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045166/rc-gadgets/assets/cat-car.webp', '65+ mph stadium truck performance with Velineon brushless power.', 12, true, false, false, true, 4),
('Volantex RC Vector SR80 Brushless RC Boat', 'RC Boats', 'Volantex', 23999, 27999, 4.9, 64, 'HOT', 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045170/rc-gadgets/assets/cat-ship.webp', 'Auto-roll back function, water-cooled brushless motor hitting speeds over 70 km/h.', 6, true, false, true, true, 5),
('FlySky FS-GT5 6CH Transmitter & Receiver', 'Accessories', 'FlySky', 6499, 7999, 4.8, 112, 'BEST', 'https://res.cloudinary.com/r28lk4ms/image/upload/v1787045168/rc-gadgets/assets/cat-gadget.webp', '6-channel ultra-fast AFHDS 2A protocol with built-in gyro receiver (FS-BS6).', 20, true, false, true, true, 6)
ON CONFLICT DO NOTHING;
