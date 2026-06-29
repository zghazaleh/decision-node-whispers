import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy / friendly URL alias.
 *
 *   /missions/1   → /mission/mission-01
 *   /missions/12  → /mission/mission-12
 *
 * The underscore in the filename (`missions_.$n.tsx`) escapes the
 * `/missions` layout so this is a standalone route that performs an
 * immediate server-side redirect to the canonical mission URL.
 */
export const Route = createFileRoute("/missions_/$n")({
  beforeLoad: ({ params }) => {
    const raw = String(params.n ?? "").trim();
    const num = Number.parseInt(raw, 10);
    if (!Number.isFinite(num) || num < 1) {
      throw redirect({ to: "/missions" });
    }
    const id = `mission-${String(num).padStart(2, "0")}`;
    throw redirect({ to: "/mission/$id", params: { id } });
  },
  component: () => null,
});
