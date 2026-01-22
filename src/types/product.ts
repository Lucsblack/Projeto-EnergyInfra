export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  is_sugar_free: boolean;
  created_at: string;
  updated_at: string;
}
