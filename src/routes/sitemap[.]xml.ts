import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { MISSIONS } from "@/lib/missions";

const BASE_URL = "https://decision-nodes.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/analysis", changefreq: "weekly", priority: "0.8" },
          { path: "/how-it-works", changefreq: "monthly", priority: "0.7" },
          { path: "/journal", changefreq: "weekly", priority: "0.6" },
          { path: "/missions", changefreq: "weekly", priority: "0.9" },
          { path: "/sound-test", changefreq: "monthly", priority: "0.5" },
          { path: "/blog/decision-making-frameworks-guide", changefreq: "monthly", priority: "0.7" },
          ...MISSIONS.map((m) => ({
            path: `/mission/${m.id}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});