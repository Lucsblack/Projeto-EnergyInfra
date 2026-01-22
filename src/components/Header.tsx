import { Zap, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Header() {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative group-hover:animate-pulse-neon transition-all duration-300">
            <Zap className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 blur-md bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold neon-text">
              Energy<span className="text-foreground">Infra</span>
            </span>
            <span className="text-[10px] text-muted-foreground -mt-1">o melhor preço da região</span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          {isAdmin ? (
            <Link to="/">
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Loja
              </Button>
            </Link>
          ) : (
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
