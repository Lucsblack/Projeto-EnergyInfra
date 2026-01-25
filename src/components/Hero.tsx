import { ArrowRight, ChevronDown, Tag } from "lucide-react";

const Hero = () => {
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.14)_0%,rgba(0,0,0,0.75)_45%,rgba(0,0,0,1)_75%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="absolute -top-36 left-1/2 h-96 w-[44rem] -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 text-center">
        {/* Badge */}
        <div className="mx-auto mb-0 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 backdrop-blur">
          <Tag className="h-4 w-4 text-green-300" />
          <span className="uppercase tracking-[0.2em]">
            Preço exclusivo para colaboradores
          </span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white">
          Energia na empresa
          <span className="block bg-gradient-to-r from-green-300 via-green-400 to-emerald-300 bg-clip-text text-transparent">
            Preço de colaborador
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-white/70 leading-relaxed">
          Na região é <span className="text-white font-semibold">R$ 13,00</span> Aqui
          dentro você paga <span className="text-green-400 font-semibold">R$ 9,50 </span>
           Conveniência + economia, sem perder a performance.
        </p>

        {/* Price highlight */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.22em] text-white/60">Preço na região</div>
            <div className="text-2xl font-semibold text-white line-through opacity-70">R$ 13,00</div>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-3">
            <div className="text-xs uppercase tracking-[0.22em] text-green-200/80">Preço interno</div>
            <div className="text-2xl font-semibold text-green-300">R$ 9,50</div>
          </div>

        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={scrollToProducts}
            className="group inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:ring-offset-2 focus:ring-offset-black"
          >
            Ver produtos
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>

          
        </div>

        {/* Micro trust */}
        <div className="mt-8 text-xs text-white/55">
          Disponível para colaboradores • Pagamento interno • Estoque limitado
        </div>

        {/* Scroll hint */}
        <button
          onClick={scrollToProducts}
          className="mt-12 inline-flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition"
          aria-label="Rolar para produtos"
        >
          <span className="text-[11px] uppercase tracking-[0.3em]">Explorar</span>
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
