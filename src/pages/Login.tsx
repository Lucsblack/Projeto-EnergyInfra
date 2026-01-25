import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/auth/AuthProvider";

export default function Login() {
  const { signInWithPassword, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || "/admin";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await signInWithPassword(email, password);
    setSubmitting(false);

    if (res.error) return setError(res.error);

    // Se logou mas não é admin, bloqueia.
    // (Melhorar com mensagem de "sem permissão")
    if (!isAdmin) {
      setError("Seu usuário não tem permissão de administrador.");
      return;
    }

    navigate(from, { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Acesso Administrativo</CardTitle>
          <CardDescription className="text-zinc-400">
            Entre com seu e-mail autorizado para gerenciar produtos e pedidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">E-mail</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="voce@empresa.com"
                className="bg-zinc-900 border-zinc-800 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Senha</label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="bg-zinc-900 border-zinc-800 text-white"
                required
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
