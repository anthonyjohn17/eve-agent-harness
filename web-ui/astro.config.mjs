import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// GitHub Pages project sites live under /<repo>/. Override with SITE_BASE=/ for
 // a custom domain or user/organization root site.
const base = process.env.SITE_BASE ?? "/eve-agent-harness/";

export default defineConfig({
  site: process.env.SITE_URL ?? "https://anthonyjohn17.github.io",
  base,
  integrations: [react()],
  trailingSlash: "always",
  build: {
    format: "directory",
  },
});
