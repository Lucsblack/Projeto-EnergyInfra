import { useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/mockData';

const REGIONAL_PRICE = 13.0;

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const stock = product.stock_quantity ?? 0;
  const isOutOfStock = stock <= 0;

  const formatPrice = (price: number) =>
    price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const { savings, discountPercent, hasDiscount } = useMemo(() => {
    const rawSavings = REGIONAL_PRICE - product.price;
    const safeSavings = Math.max(0, rawSavings);
    const percent =
      REGIONAL_PRICE > 0 ? Math.round((safeSavings / REGIONAL_PRICE) * 100) : 0;

    return {
      savings: safeSavings,
      discountPercent: percent,
      hasDiscount: safeSavings > 0 && percent > 0,
    };
  }, [product.price]);

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, stock));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <Card className="group relative overflow-hidden border-border bg-card/40 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex gap-2">
        {isOutOfStock && (
          <Badge className="bg-muted text-muted-foreground border border-border">
            Esgotado
          </Badge>
        )}

        {!isOutOfStock && hasDiscount && (
          <Badge className="bg-primary text-primary-foreground shadow-sm">
            -{discountPercent}%
          </Badge>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
            isOutOfStock ? 'grayscale opacity-70' : ''
          }`}
        />

        {/* subtle gradient for readability */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/70 to-transparent" />
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Title + description */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-tight text-foreground line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {formatPrice(product.price)}
              </span>

              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(REGIONAL_PRICE)}
                </span>
              )}
            </div>

            {!isOutOfStock && (
              <span className="text-xs text-muted-foreground">
                {stock} em estoque
              </span>
            )}
          </div>

          {hasDiscount && (
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/5 text-primary"
            >
              Economize {formatPrice(savings)}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="pt-1">
          {!isOutOfStock ? (
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div
                className="flex items-center rounded-lg border border-border bg-background"
                aria-label="Selecionar quantidade"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-r-none"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span
                  className="w-10 text-center text-sm font-medium tabular-nums"
                  aria-live="polite"
                >
                  {quantity}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-l-none"
                  onClick={handleIncrement}
                  disabled={quantity >= stock}
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* CTA */}
              <Button
                type="button"
                onClick={handleAddToCart}
                className="flex-1"
              >
                Adicionar
              </Button>
            </div>
          ) : (
            <Button type="button" disabled className="w-full">
              Indisponível
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
