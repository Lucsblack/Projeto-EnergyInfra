import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/lib/mockData';

const generateToken = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useStockReservation = () => {
  const queryClient = useQueryClient();

  const createReservation = useMutation({
    mutationFn: async (items: CartItem[]) => {
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Create reservations for each item
      const reservations = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        reservation_token: `${token}-${item.product.id}`,
        expires_at: expiresAt.toISOString(),
      }));

      const { data, error } = await supabase
        .from('stock_reservations')
        .insert(reservations)
        .select();

      if (error) throw error;

      // Decrease stock temporarily
      for (const item of items) {
        const { error: updateError } = await supabase
          .from('products')
          .update({
            stock_quantity: item.product.stock_quantity - item.quantity,
          })
          .eq('id', item.product.id);

        if (updateError) throw updateError;
      }

      return { token, reservations: data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const completeReservation = useMutation({
    mutationFn: async ({
      token,
      items,
      customerPhone,
    }: {
      token: string;
      items: CartItem[];
      customerPhone?: string;
    }) => {
      // Mark reservations as completed
      for (const item of items) {
        const reservationToken = `${token}-${item.product.id}`;
        
        await supabase
          .from('stock_reservations')
          .update({ is_completed: true })
          .eq('reservation_token', reservationToken);

        // Record the sale
        await supabase.from('sales').insert({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity,
          customer_phone: customerPhone,
          reservation_token: reservationToken,
        });
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const cancelReservation = useMutation({
    mutationFn: async ({
      token,
      items,
    }: {
      token: string;
      items: CartItem[];
    }) => {
      // Restore stock and delete reservations
      for (const item of items) {
        const reservationToken = `${token}-${item.product.id}`;

        // Get current stock
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product.id)
          .single();

        if (product) {
          // Restore stock
          await supabase
            .from('products')
            .update({
              stock_quantity: product.stock_quantity + item.quantity,
            })
            .eq('id', item.product.id);
        }

        // Delete reservation
        await supabase
          .from('stock_reservations')
          .delete()
          .eq('reservation_token', reservationToken);
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    createReservation,
    completeReservation,
    cancelReservation,
  };
};
