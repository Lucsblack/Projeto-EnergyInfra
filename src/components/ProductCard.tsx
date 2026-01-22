import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { getProductImage } from "@/lib/productImages";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = product.stock;

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleBuy = () => {
    if (product.stock === 0) {
      toast.error("Produto esgotado!");
      return;
    }

    const total = (product.price * quantity).toFixed(2).replace(".", ",");
    const message = encodeURIComponent(
      `Olá! Gostaria de comprar:\n\n` +
        `📦 Produto: ${product.name}\n` +
        `🔢 Quantidade: ${quantity} unidade(s)\n` +
        `💰 Valor unitário: R$ ${product.price.toFixed(2).replace(".", ",")}\n` +
        `💵 Total: R$ ${total}\n\n` +
        `Por favor, confirme a disponibilidade!`
    );

    // Replace with your WhatsApp number
    const whatsappNumber = "5511999999999";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, "_blank");
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative glass-card overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:neon-glow">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500" />

      {/* Sugar free badge */}
      {product.is_sugar_free && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 text-xs font-display uppercase bg-primary/20 text-primary rounded-full border border-primary/30 neon-border">
            Zero Açúcar
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
        <img
          src={getProductImage(product.name, product.image_url)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
            <span className="font-display text-lg text-destructive uppercase tracking-wider">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1 group-hover:neon-text transition-all duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-display font-bold neon-text">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-xs text-muted-foreground">
              {product.stock} em estoque
            </p>
          </div>
        </div>

        {/* Quantity selector */}
        {!isOutOfStock && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
              <button
                type="button"
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDecrease}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-display font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleIncrease}
                disabled={quantity >= maxQuantity}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              variant="neon"
              className="flex-1"
              onClick={handleBuy}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Comprar
            </Button>
          </div>
        )}

        {isOutOfStock && (
          <Button variant="outline" className="w-full" disabled>
            <Zap className="h-4 w-4 mr-2" />
            Indisponível
          </Button>
        )}
      </div>
    </div>
  );
}
