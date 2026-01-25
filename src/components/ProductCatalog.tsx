import { useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import { Product } from '@/lib/mockData';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCatalogProps {
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCatalog = ({ onAddToCart }: ProductCatalogProps) => {
  const { data: products, isLoading, error } = useProducts();

  const productCount = products?.length ?? 0;
  const hasProducts = productCount > 0;

  const loadingCards = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

  return (
    <section
      id="products"
      className="relative py-16 md:py-24 bg-background overflow-hidden"
      aria-busy={isLoading}
    >
      {/* subtle background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-5xl text-center mb-10 md:mb-14">
          <p className="text-sm font-medium text-muted-foreground">
            Energize sua rotina
          </p>

          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Nossos Produtos
          </h2>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              {isLoading ? 'Carregando…' : `${productCount} item(ns)`}
            </span>
          </div>

          <div className="mt-6 h-px w-full bg-border/70" />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingCards.map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card/40 p-4 space-y-4"
              >
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-9 w-24 rounded-md" />
                  <Skeleton className="h-9 w-28 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
              <p className="text-sm font-medium text-destructive">
                Não foi possível carregar os produtos
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Verifique sua conexão ou tente novamente em instantes.
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && (
          <>
            {hasProducts ? (
              <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products!.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-2xl">
                <div className="rounded-xl border border-border bg-card/40 p-8 text-center">
                  <p className="text-base font-semibold text-foreground">
                    Nenhum produto disponível no momento
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Estamos atualizando o catálogo. Volte em breve 🙂
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
