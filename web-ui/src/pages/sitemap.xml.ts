import type { APIRoute } from "astro";
import { primaryNav } from "../data/site";

export const GET: APIRoute = ({ site }) => {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
  const origin = site?.origin ?? "https://anthonyjohn17.github.io";

  const urls = primaryNav.map((item) => {
    const path = item.href === "/" ? `${base}/` : `${base}${item.href}`;
    return new URL(path, `${origin}/`).href;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url><loc>${loc}</loc><changefreq>weekly</changefreq></url>`).join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
