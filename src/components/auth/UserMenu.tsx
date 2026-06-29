import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthUser } from "@/lib/auth-sync";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function UserMenu() {
  const user = useAuthUser();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Link
        to="/auth"
        className="text-[10px] tracking-[0.25em] uppercase text-foreground/70 hover:text-foreground border border-foreground/20 hover:border-foreground/50 rounded-full px-3 py-1.5 transition-colors"
      >
        Sign in
      </Link>
    );
  }

  const initial = (user.email ?? "?").slice(0, 1).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account"
          className="h-8 w-8 rounded-full border border-foreground/20 hover:border-foreground/50 text-xs font-medium bg-background/60 backdrop-blur transition-colors"
        >
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        <DropdownMenuLabel className="text-xs text-muted-foreground truncate">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
            toast.success("Signed out.");
            navigate({ to: "/" });
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
