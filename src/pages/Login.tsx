import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth/AuthProvider";

export default function Login() {
  const { signInWithPassword, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || "/admin";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setInfo(null);

    const action =
      mode === "login"
        ? await signInWithPassword(email, password)
        : await signUp(email, password);

    setSubmitting(false);

    if (action.error) {
      setError(action.error);
      return;
    }

    if (mode === "signup") {
      // Alguns projetos exigem confirmação por e-mail antes de logar.
      setInfo("Usuário criado! Se o Supabase exigir confirmação, verifique seu e-mail. Depois volte e faça login.");
      setMode("login");
      return;
    }

    navigate(from, { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">
            {mode === "login" ? "Entrar no Admin" : "Criar acesso"}
          </h1>

        </div>

        <p className="mt-2 text-sm text-white/70">
          {mode === "login"
            ? "Acesse com o e-mail e senha."
            : "Crie seu usuário para liberar o acesso agora (temporário)."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-white/70">E-mail</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="seuemail@empresa.com"
              className="bg-black/40 border-white/10 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/70">Senha</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="bg-black/40 border-white/10 text-white"
              required
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {info && <p className="text-sm text-green-300">{info}</p>}

          <Button className="w-full" type="submit" disabled={submitting}>
            {submitting
              ? "Aguarde..."
              : mode === "login"
              ? "Entrar"
              : "Criar usuário"}
          </Button>
        </form>
      </div>
    </div>
  );
}
