import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80)',
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 gradient-overlay" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 tracking-tight">
          TRABALHE COM
          <br />
          <span className="text-primary text-glow">MAIS ENERGIA</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Energéticos premium para impulsionar sua produtividade
        </p>

        <button
          onClick={scrollToProducts}
          className="group flex flex-col items-center gap-2 mx-auto text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-sm uppercase tracking-widest">Ver produtos</span>
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
