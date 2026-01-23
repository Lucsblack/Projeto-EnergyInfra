export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  is_active: boolean;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Monster Energy Ultra',
    description: 'Lata 473ml (sem açúcar)',
    price: 9.50,
    stock_quantity: 50,
    image_url: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400',
    is_active: true,
  },
  {
    id: '2',
    name: 'Monster Energy Tradicional',
    description: 'Lata 473ml',
    price: 9.50,
    stock_quantity: 50,
    image_url: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
    is_active: true,
  },
  {
    id: '3',
    name: 'Monster Energy Tradicional',
    description: 'Lata 473ml (sem açúcar)',
    price: 9.50,
    stock_quantity: 50,
    image_url: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400',
    is_active: true,
  },
];

export interface CartItem {
  product: Product;
  quantity: number;
}
