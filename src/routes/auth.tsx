import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Decision Nodes" },
      { name: "description", content: "Sign in to save your Decision Profile across devices." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // If already signed in, bounce home.
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled && data.user) navigate({ to: "/" });
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
        navigate({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };

  const oauth = async (provider: "google" | "apple") => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error instanceof Error ? result.error.message : "OAuth failed.");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-[100svh] flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link to="/" className="text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground">
            Decision Nodes
          </Link>
          <h1 className="font-display text-3xl mt-6">
            {mode === "signin" ? "Continue." : "Begin."}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to restore your Decision Profile."
              : "Create an account to keep your profile across devices."}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" disabled={busy} onClick={() => oauth("google")}>
            Continue with Google
          </Button>
          <Button variant="outline" disabled={busy} onClick={() => oauth("apple")}>
            Continue with Apple
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
          <div className="h-px flex-1 bg-foreground/15" /> or <div className="h-px flex-1 bg-foreground/15" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={busy} className="mt-2">
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "signin" ? (
            <>
              No account?{" "}
              <button onClick={() => setMode("signup")} className="underline hover:text-foreground">
                Create one
              </button>
            </>
          ) : (
            <>
              Already have one?{" "}
              <button onClick={() => setMode("signin")} className="underline hover:text-foreground">
                Sign in
              </button>
            </>
          )}
        </p>

        <p className="mt-8 text-center text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
          <Link to="/">Play without an account</Link>
        </p>
      </div>
    </main>
  );
}
