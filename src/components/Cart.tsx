import { X, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/lib/mockData';
import { useStockReservation } from '@/hooks/useStockReservation';
import { useState } from 'react';
import { toast } from 'sonner';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  total: number;
}

const WHATSAPP_NUMBER = '5511999999999'; // Replace with actual number

const Cart = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  total,
}: CartProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createReservation } = useStockReservation();

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const generateWhatsAppMessage = () => {
    let message = '🛒 *Pedido EnergyTi*\n\n';
    
    items.forEach((item) => {
      message += `• ${item.product.name}\n`;
      message += `  ${item.product.description}\n`;
      message += `  Qtd: ${item.quantity} x ${formatPrice(item.product.price)}\n`;
      message += `  Subtotal: ${formatPrice(item.product.price * item.quantity)}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━\n`;
    message += `*Total: ${formatPrice(total)}*`;

    return encodeURIComponent(message);
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }

    setIsProcessing(true);

    try {
      // Create stock reservation
      await createReservation.mutateAsync(items);

      // Generate WhatsApp link
      const message = generateWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Clear cart
      onClearCart();
      onClose();

      toast.success('Redirecionando para o WhatsApp...');
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Cart panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Carrinho</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p>Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-muted rounded-lg"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {item.product.description}
                    </p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center border border-border rounded">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-xs">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.stock_quantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(total)}
              </span>
            </div>

            <Button
              className="w-full bg-transparent border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all gap-2"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              <MessageCircle className="h-5 w-5" />
              {isProcessing ? 'Processando...' : 'Comprar via WhatsApp'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
