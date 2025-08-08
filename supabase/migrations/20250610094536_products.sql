BEGIN;

-- Create products table with all necessary columns
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_open BOOLEAN DEFAULT TRUE,
    sorting INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on code for better performance
CREATE INDEX IF NOT EXISTS idx_products_code ON public.products(code);

-- Insert sample products with conflict handling
INSERT INTO public.products (name, code, price, image_url, is_open, sorting) 
VALUES
('ERIN Men''s Wear 2 Colors Men Pants Men Simple Beam Feet Cargo Pants Breathable for Daily Life', 'ERIN001', 6.82, '/lovable-uploads/e712301c-6a6b-431c-aca1-bc570d1a522e.png', true, 100),
('Sandisk Ultra Flair USB 3.0 Thumb Drive Flash Drive Pen Drive 150MB/s 16GB 32GB 64GB 128GB CZ73 T2BUY SG', 'SAND001', 4.58, '/lovable-uploads/e712301c-6a6b-431c-aca1-bc570d1a522e.png', true, 100),
('YONEX Grip High Quality Soft Grip Super Grap Anti-slip Badminton Grip', 'YONX001', 1.27, '/lovable-uploads/e712301c-6a6b-431c-aca1-bc570d1a522e.png', true, 100),
('Terro Liquid Ant Killer 29.5ML (1oz) /59ML (2oz) & 10ML (10g) Baits (Not Gel)', 'TERR001', 7.62, '/lovable-uploads/e712301c-6a6b-431c-aca1-bc570d1a522e.png', true, 100),
('Choose The Color Of The Short cargo Pants For Boys 1-13 Years', 'CARG001', 4.48, '/lovable-uploads/e712301c-6a6b-431c-aca1-bc570d1a522e.png', true, 100),
('Apple iPhone 15 Pro Max 256GB Natural Titanium', 'APPL001', 1299.99, '/lovable-uploads/e712301c-6a6b-431c-aca1-bc570d1a522e.png', true, 50),
('Samsung Galaxy S24 Ultra 512GB Titanium Black', 'SAMS001', 1199.99, '/lovable-uploads/e712301c-6a6b-431c-aca1-bc570d1a522e.png', true, 50)
ON CONFLICT (code) DO NOTHING;

-- Enable Row Level Security if needed
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

COMMIT;