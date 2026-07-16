# Eve Agent Harness Website

Static multi-page product site for **Eve Agent Harness**, built with Astro and
ready for GitHub Pages.

## Design system

Palette from [`design/hex.jpeg`](./design/hex.jpeg):

| Token | Hex | Role |
|-------|-----|------|
| Syrah | `#6a282c` | Brand primary, CTAs, emphasis |
| Blue Glow | `#b2d4dd` | Borders, secondary surfaces |
| Bit of Blue | `#e2eaeb` | Page background |

Texture inspiration: [`design/sample.jpeg`](./design/sample.jpeg).

## Develop

```bash
cd web-ui
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

By default the site builds with base path `/eve-agent-harness/` for a GitHub
Pages project site. For a custom domain or root site:

```bash
SITE_BASE=/ SITE_URL=https://example.com pnpm build
```

## Deploy to GitHub Pages

1. In the GitHub repo settings, set Pages source to the `gh-pages` branch
   (root).
2. From this folder:

```bash
pnpm deploy
```

That runs `astro check`, builds static HTML into `dist/`, and publishes via
`gh-pages`. A `.nojekyll` file is included so GitHub Pages serves underscore
paths correctly.

## Structure

```text
web-ui/
├── design/           # Design references (palette + texture)
├── public/           # Static assets (textures, favicon, .nojekyll)
├── src/
│   ├── components/   # Shared UI + simulated analyst demo
│   ├── data/         # Typed content model (claims stay consistent)
│   ├── layouts/      # Site shell
│   ├── pages/        # Multi-page routes
│   └── styles/       # Design tokens + global CSS
├── astro.config.mjs
├── pnpm-workspace.yaml  # pnpm 11 allowBuilds for esbuild/sharp
└── package.json
```

## Notes

- The analyst demo on the site is a **deterministic simulation** — it does not
  call a live model or backend.
- Framework name is always `eve` (lowercase). This distribution is
  **Eve Agent Harness**.
- Claims distinguish implemented capabilities, preview caveats, and roadmap
  items using the repository specs and READMEs.
