import { ShoppingCart, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemCount, onCartClick }: HeaderProps) => {
  const { isAdmin, user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="leading-tight">
            <div className="text-base font-semibold text-white tracking-tight">
              Energy<span className="text-green-400">Ti</span>
            </div>
            
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Admin (somente admin) */}
          {isAdmin && (
            <>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Admin"
                title={user?.email ?? "Admin"}
              >
                <Link to="/admin">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Sair"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="relative h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition flex items-center justify-center"
            aria-label="Carrinho"
            title="Carrinho"
          >
            <ShoppingCart className="h-5 w-5" />

            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-green-500 text-black text-[11px] leading-[18px] font-semibold flex items-center justify-center shadow">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
