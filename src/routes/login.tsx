import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Přihlášení — I&E Tile Services" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/admin", replace: true });
  }, [session, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin", replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Něco se pokazilo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="container-luxe py-24 lg:py-32">
      <div className="mx-auto max-w-md">
        <div className="text-xs uppercase tracking-[0.3em] text-gold">Admin</div>
        <h1 className="mt-4 font-display text-4xl">Přihlášení</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Přihlaste se pro správu galerie.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-border focus:border-gold outline-none px-4 py-3 text-foreground transition-smooth"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Heslo
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-border focus:border-gold outline-none px-4 py-3 text-foreground transition-smooth"
            />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-gold text-primary-foreground py-3 text-xs uppercase tracking-[0.25em] hover:opacity-90 transition-smooth disabled:opacity-50"
          >
            {busy ? "..." : "Přihlásit se"}
          </button>
        </form>

        <div className="mt-12 text-center">
          <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold">
            ← Zpět na web
          </Link>
        </div>
      </div>
    </section>
  );
}
