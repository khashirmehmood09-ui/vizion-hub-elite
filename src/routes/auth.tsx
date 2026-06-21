import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Sign In" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    setLoading(true);
    const { error } = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (mode === "signup") toast.success("Account created — check your email to confirm.");
    else navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-aurora">
      <div className="glass rounded-2xl w-full max-w-sm p-6">
        <h1 className="font-display text-xl font-semibold">Admin {mode === "signin" ? "Sign in" : "Sign up"}</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your portfolio content.</p>
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <input name="email" type="email" required placeholder="Email" className="w-full glass rounded-xl px-3 py-2.5 text-sm" />
          <input name="password" type="password" required minLength={6} placeholder="Password" className="w-full glass rounded-xl px-3 py-2.5 text-sm" />
          <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] px-4 py-2.5 text-sm font-medium text-background disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Create an account" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}