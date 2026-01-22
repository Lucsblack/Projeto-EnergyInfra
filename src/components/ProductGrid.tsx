import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Loader2, Zap } from "lucide-react";

export function ProductGrid() {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">Erro ao carregar produtos</p>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="text-center py-20">
        <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nenhum produto disponível</p>
      </div>
    );
  }

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="neon-text">NOSSOS</span> ENERGÉTICOS
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Escolha seu favorito e sinta a energia
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
