import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
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
  const isOutOfStock = product.stock_quantity <= 0;

  const handleIncrement = () => {
    if (quantity < product.stock_quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      onAddToCart(product, quantity);
      setQuantity(1);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const savings = REGIONAL_PRICE - product.price;
  const discountPercent = Math.round((savings / REGIONAL_PRICE) * 100);

  return (
    <Card className="group relative bg-card border-border overflow-hidden transition-all duration-300 hover:border-primary/30 hover:box-glow">
      {/* Discount Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-discount text-discount-foreground font-bold text-sm px-3 py-1 animate-pulse shadow-lg shadow-discount/30">
          -{discountPercent}% OFF
        </Badge>
      </div>

      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-foreground text-lg leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {product.description}
          </p>
        </div>

        {/* Price Display with Discount */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(REGIONAL_PRICE)}
            </span>
            <span className="text-2xl font-bold text-primary text-glow">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 font-medium">
              Economize {formatPrice(savings)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {isOutOfStock ? 'Esgotado' : `${product.stock_quantity} em estoque`}
          </span>
        </div>

        {!isOutOfStock && (
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-sm font-medium">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-l-none"
                onClick={handleIncrement}
                disabled={quantity >= product.stock_quantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="flex-1 bg-transparent border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              onClick={handleAddToCart}
            >
              Adicionar
            </Button>
          </div>
        )}

        {isOutOfStock && (
          <Button disabled className="w-full">
            Indisponível
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
