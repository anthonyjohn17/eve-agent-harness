export const site = {
  name: "Eve Agent Harness",
  tagline: "An AI agent is a folder.",
  description:
    "Standalone open-source workspace for building durable, production-shaped AI agents with the filesystem-first eve framework.",
  thesis: "Authoring is the filesystem. Compilation is the framework.",
  maintainer: {
    name: "John Anthony",
    url: "https://github.com/anthonyjohn17",
  },
  repo: {
    url: "https://github.com/anthonyjohn17/eve-agent-harness",
    label: "anthonyjohn17/eve-agent-harness",
  },
  docs: {
    eve: "https://eve.dev/docs",
    npm: "https://www.npmjs.com/package/eve",
  },
  license: "Apache-2.0",
  versionNote:
    "eve is pre-1.0 / preview-quality. APIs may change. Configure auth, approvals, and sandbox network explicitly for production.",
} as const;

export type NavItem = {
  href: string;
  label: string;
  description?: string;
};

export const primaryNav: NavItem[] = [
  { href: "/", label: "Home", description: "Pitch and overview" },
  {
    href: "/how-it-works/",
    label: "How it works",
    description: "Discovery, compile, runtime",
  },
  {
    href: "/capabilities/",
    label: "Capabilities",
    description: "Full primitive surface",
  },
  {
    href: "/eve-analyst/",
    label: "eve-analyst",
    description: "Flagship reference agent",
  },
  {
    href: "/gallery/",
    label: "Gallery",
    description: "Support, research, ops",
  },
  {
    href: "/get-started/",
    label: "Get started",
    description: "Install, demo, deploy",
  },
  {
    href: "/safety-roadmap/",
    label: "Safety & roadmap",
    description: "Defaults, provenance, plans",
  },
];

export const folderTree = `agent/
├── agent.ts            # Model + runtime config
├── instructions.md     # Always-on system prompt
├── tools/              # Typed functions the model can call
├── skills/             # Procedures loaded on demand
├── channels/           # HTTP, Slack, Discord, …
├── subagents/          # Specialist workers
├── schedules/          # Recurring autonomous jobs
├── connections/        # MCP / OpenAPI integrations
├── sandbox.ts          # Isolated code execution policy
└── (sibling) evals/    # Behavioral tests that gate shipping`;

export const runtimePipeline = `Authoring (agent/)
        ↓
  discoverAgent → compileAgent (.eve/)
        ↓
  Nitro host + Workflow durable runtime
        ↓
  Channels ↔ Session / Turn / Step ↔ Tool-loop harness
        ↓
  Sandbox / Connections / Subagents / HITL`;
