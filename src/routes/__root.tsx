import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-7xl text-foreground">404</p>
        <p className="mt-4 text-sm tracking-[0.2em] uppercase text-muted-foreground">
          Signal lost
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="text-sm tracking-[0.2em] uppercase text-foreground/80 hover:text-foreground border-b border-foreground/30 hover:border-foreground pb-1 transition-colors"
          >
            Return
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-3xl text-foreground">The signal broke.</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Something interrupted the moment. Try again.
        </p>
        <div className="mt-8 flex justify-center gap-6 text-sm tracking-[0.2em] uppercase">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="text-foreground/80 hover:text-foreground border-b border-foreground/30 hover:border-foreground pb-1 transition-colors"
          >
            Retry
          </button>
          <a
            href="/"
            className="text-foreground/80 hover:text-foreground border-b border-foreground/30 hover:border-foreground pb-1 transition-colors"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#000000" },
      { title: "Decision Node — An Interactive Drama" },
      {
        name: "description",
        content:
          "You wake up in someone else's body moments before the most important decision of their life.",
      },
      { property: "og:title", content: "Decision Node — An Interactive Drama" },
      {
        property: "og:description",
        content:
          "You wake up in someone else's body moments before the most important decision of their life.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Decision Node — An Interactive Drama" },
      { name: "description", content: "An interactive drama about consequential decisions." },
      { property: "og:description", content: "An interactive drama about consequential decisions." },
      { name: "twitter:description", content: "An interactive drama about consequential decisions." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5d91de4e-9d1c-4edf-863c-3d63866fc4fd/id-preview-29db16bb--5c0a2ea2-d89d-46f4-9789-6a6867e7e361.lovable.app-1782529685980.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5d91de4e-9d1c-4edf-863c-3d63866fc4fd/id-preview-29db16bb--5c0a2ea2-d89d-46f4-9789-6a6867e7e361.lovable.app-1782529685980.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400&family=Inter+Tight:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>

  );
}
