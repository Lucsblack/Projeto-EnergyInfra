import { useState, useCallback } from 'react';
import { Product, CartItem } from '@/lib/mockData';
import { toast } from 'sonner';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    if (quantity <= 0) {
      toast.error('Quantidade inválida');
      return;
    }

    setItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        
        if (newQuantity > product.stock_quantity) {
          toast.error(`Estoque insuficiente. Disponível: ${product.stock_quantity}`);
          return prev;
        }
        
        toast.success(`${product.name} atualizado no carrinho`);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      if (quantity > product.stock_quantity) {
        toast.error(`Estoque insuficiente. Disponível: ${product.stock_quantity}`);
        return prev;
      }
      
      toast.success(`${product.name} adicionado ao carrinho`);
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
    toast.success('Item removido do carrinho');
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock_quantity) {
            toast.error(`Estoque insuficiente. Disponível: ${item.product.stock_quantity}`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    isOpen,
    setIsOpen,
  };
};
