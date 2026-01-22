import { Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-float">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              O melhor preço da região
            </span>
          </div>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
          <span className="text-foreground">LIBERE SUA</span>
          <br />
          <span className="gradient-text hover:animate-glow transition-all duration-300">ENERGIA</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Os melhores energéticos do mercado com entrega rápida.
          <br />
          <span className="text-primary font-semibold">R$ 9,50</span> por unidade
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="neon"
            size="xl"
            onClick={scrollToProducts}
            className="group"
          >
            <Zap className="h-5 w-5 mr-2 group-hover:animate-bounce" />
            Ver Produtos
          </Button>
        </div>

        <button
          onClick={scrollToProducts}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}
