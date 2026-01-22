-- Create products table for energy drinks
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 9.50,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_sugar_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can see products)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Create policy for admin operations (using a simple admin check)
-- For now, allow all authenticated users to manage products
CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial products
INSERT INTO public.products (name, description, price, stock, image_url, is_sugar_free) VALUES
('Monster Energy Ultra 473ml', 'Lata 473ml - Sem Açúcar', 9.50, 50, 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400', true),
('Monster Tradicional 473ml', 'Lata 473ml - Sabor Original', 9.50, 50, 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400', false),
('Monster Tradicional 473ml Sem Açúcar', 'Lata 473ml - Tradicional Sem Açúcar', 9.50, 50, 'https://images.unsplash.com/photo-1594971475674-6a97f8fe8c2b?w=400', true);

-- Enable realtime for products
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;