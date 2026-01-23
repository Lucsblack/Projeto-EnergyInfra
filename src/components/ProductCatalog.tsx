import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import { Product } from '@/lib/mockData';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCatalogProps {
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCatalog = ({ onAddToCart }: ProductCatalogProps) => {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <section id="products" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Nossos Produtos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Erro ao carregar produtos</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Nossos Produtos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {(!products || products.length === 0) && (
          <p className="text-center text-muted-foreground">
            Nenhum produto disponível no momento
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
