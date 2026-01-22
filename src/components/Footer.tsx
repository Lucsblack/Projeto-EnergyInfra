import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-10 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-display font-bold neon-text">
              ENERGY<span className="text-foreground">ZONE</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EnergyZone. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
