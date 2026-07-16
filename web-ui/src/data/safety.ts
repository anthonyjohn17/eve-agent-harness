export type SafetyItem = {
  id: string;
  title: string;
  severity: "critical" | "important" | "note";
  detail: string;
  mitigation: string;
};

export const safetyItems: SafetyItem[] = [
  {
    id: "none-auth",
    title: "Demo HTTP auth includes none()",
    severity: "critical",
    detail:
      "eve-analyst agent/channels/eve.ts stacks vercelOidc(), localDev(), and none() so the public demo is reachable without credentials.",
    mitigation:
      "Remove none() before any real deployment. Add Auth.js, Clerk, httpBasic, or equivalent.",
  },
  {
    id: "sandbox-network",
    title: "Sandbox network defaults to allow-all",
    severity: "critical",
    detail:
      "Unless you override networkPolicy, sandboxed code can reach the network. eve-analyst sets deny-all for Docker, Vercel, and microsandbox backends.",
    mitigation:
      "Always set networkPolicy: \"deny-all\" for untrusted code execution in production agents.",
  },
  {
    id: "approval-default",
    title: "Omitting tool approval means no human gate",
    severity: "important",
    detail:
      "If a tool does not declare an approval policy, it runs without pausing for a human.",
    mitigation:
      "Add approval callbacks on risky tools (writes, expensive scans, destructive actions).",
  },
  {
    id: "investigator-sql",
    title: "Investigator subagent runs SQL without approval",
    severity: "important",
    detail:
      "By design the investigator can dig autonomously. Queries remain read-only via shared guards, but expensive SELECTs may not park.",
    mitigation:
      "Keep read-only enforcement; consider approval policies if cost or latency matters.",
  },
  {
    id: "evals-manual",
    title: "Evals are not auto-run on deploy",
    severity: "note",
    detail:
      "eve deploy does not invoke eve eval. The harness treats evals as a CI / pre-deploy gate you wire yourself.",
    mitigation: "Run pnpm exec eve eval --strict in CI before shipping.",
  },
  {
    id: "preview",
    title: "Pre-1.0 preview quality",
    severity: "note",
    detail:
      "APIs may change. The distribution does not claim ownership of the npm eve namespace without a deliberate publish plan.",
    mitigation:
      "Pin versions, read changelogs, and prefer node_modules/eve/docs/ as the installed source of truth.",
  },
];

export const roadmap = [
  {
    phase: 1,
    title: "Unify CI",
    items: [
      "Root harness CI",
      "Wire eve-analyst and examples to the local eve/ package",
    ],
  },
  {
    phase: 2,
    title: "Production templates",
    items: [
      "Auth templates",
      "Warehouse adapter",
      "Schedules example",
      "Durable glossary state",
      "Web UI (this site is the marketing surface; live agent chat remains separate)",
    ],
  },
  {
    phase: 3,
    title: "Gallery eval coverage",
    items: [
      "Promote example eval placeholders into real eval suites",
    ],
  },
  {
    phase: 4,
    title: "Self-host polish",
    items: [
      "Documented Docker + Postgres workflow world",
      "Release automation under this repo's package/container namespaces",
    ],
  },
];

export const doNotClaim = [
  {
    claim: "Evals run automatically on every deploy",
    truth: "Run eve eval --strict in CI. Not wired into eve deploy.",
  },
  {
    claim: "Production-ready out of the box",
    truth:
      "Preview quality; demo uses none() auth and in-memory SQLite. Configure safeguards.",
  },
  {
    claim: "Gallery agents have full eval coverage",
    truth: "Placeholders only; real suites are roadmap Phase 3.",
  },
  {
    claim: "We own the npm eve package namespace",
    truth:
      "eve is used for compatibility. No ownership claim without a publish plan.",
  },
  {
    claim: "This replaces Vercel d0 / internal systems",
    truth:
      "eve-analyst is inspired by production analyst patterns; it does not contain or replace d0.",
  },
  {
    claim: "Eve-AI-Agent-Framework.md is the product spec",
    truth: "Background research only. Prefer docs/FRAMEWORK_SPEC.md.",
  },
];

export const quickStarts = {
  analyst: `ANTHROPIC_API_KEY=sk-ant-... pnpm demo:analyst`,
  gallery: `cp -R examples/support-agent my-agent && cd my-agent
pnpm install && pnpm dev`,
  scaffold: `npx eve@latest init my-agent`,
  framework: `cd eve
pnpm install
pnpm build
pnpm dev
pnpm test:unit`,
  validateAnalyst: `cd eve-analyst && pnpm typecheck && node --test test/*.test.ts
pnpm exec eve eval --strict`,
  validateFramework: `cd eve && pnpm lint && pnpm typecheck && pnpm test:unit`,
  selfHost: `cd eve-analyst
pnpm build && pnpm start`,
  deploy: `cd eve-analyst
pnpm exec eve link
pnpm exec eve deploy`,
};

export const requirements = [
  "Node 24+",
  "pnpm (repo uses pnpm@11.7.0)",
  "ANTHROPIC_API_KEY for model-backed demos",
];
