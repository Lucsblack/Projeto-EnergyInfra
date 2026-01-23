-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 9.50,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stock_reservations table for temporary reservations
CREATE TABLE public.stock_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  reservation_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales table for tracking completed purchases
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  customer_phone TEXT,
  reservation_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
CREATE POLICY "Products are publicly viewable"
  ON public.products FOR SELECT
  USING (true);

-- Products can be managed by anyone (for admin - will add auth later)
CREATE POLICY "Products can be managed"
  ON public.products FOR ALL
  USING (true)
  WITH CHECK (true);

-- Stock reservations policies
CREATE POLICY "Reservations are publicly viewable"
  ON public.stock_reservations FOR SELECT
  USING (true);

CREATE POLICY "Reservations can be managed"
  ON public.stock_reservations FOR ALL
  USING (true)
  WITH CHECK (true);

-- Sales policies
CREATE POLICY "Sales are publicly viewable"
  ON public.sales FOR SELECT
  USING (true);

CREATE POLICY "Sales can be created"
  ON public.sales FOR INSERT
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger to products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial products
INSERT INTO public.products (name, description, price, stock_quantity, image_url) VALUES
  ('Monster Energy Ultra', 'Lata 473ml (sem açúcar)', 9.50, 50, 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400'),
  ('Monster Energy Tradicional', 'Lata 473ml', 9.50, 50, 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400'),
  ('Monster Energy Tradicional', 'Lata 473ml (sem açúcar)', 9.50, 50, 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400');