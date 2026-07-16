export type Status = "implemented" | "roadmap" | "demo-caveat";

export type Capability = {
  id: string;
  name: string;
  status: Status;
  summary: string;
  details: string;
  slot?: string;
  helper?: string;
};

export const capabilities: Capability[] = [
  {
    id: "filesystem",
    name: "Filesystem authoring",
    status: "implemented",
    summary: "An agent is a directory. Identity comes from the path.",
    details:
      "Drop files into conventional slots under agent/. No redundant name or id fields on define* calls. Discovery walks the tree and compilation writes inspectable .eve/ artifacts.",
    slot: "agent/",
  },
  {
    id: "compiler",
    name: "Discovery + compilation",
    status: "implemented",
    summary: "The framework wires capabilities automatically.",
    details:
      "eve walks agent/, builds manifests under .eve/, and connects tools, skills, channels, subagents, schedules, and connections without a central registry in agent.ts.",
  },
  {
    id: "tools",
    name: "Typed tools",
    status: "implemented",
    summary: "defineTool with Zod schemas under agent/tools/.",
    details:
      "Tools are typed executable functions. Omitting approval means no human gate — configure approval policies for risky actions.",
    slot: "agent/tools/<name>.ts",
    helper: "defineTool",
  },
  {
    id: "hitl",
    name: "Human-in-the-loop approval",
    status: "implemented",
    summary: "Tool approval policies with durable pause and resume.",
    details:
      "Approval callbacks can park a turn until a human confirms. Sessions survive restarts via the Workflow-backed runtime.",
    helper: "approval",
  },
  {
    id: "skills",
    name: "Skills",
    status: "implemented",
    summary: "On-demand procedures — business rules and playbooks.",
    details:
      "Markdown or TypeScript under agent/skills/. Frontmatter description tells the model when to load the skill body.",
    slot: "agent/skills/<name>.md",
    helper: "defineSkill",
  },
  {
    id: "subagents",
    name: "Subagents",
    status: "implemented",
    summary: "Nested agent packages the parent can delegate to.",
    details:
      "Each subagent under agent/subagents/<id>/ is a full package with its own tools and skills. Subagents do not inherit parent capabilities. Remote subagents are also supported.",
    slot: "agent/subagents/<id>/",
    helper: "defineAgent + description",
  },
  {
    id: "sandbox",
    name: "Sandbox backends",
    status: "implemented",
    summary: "Isolated code execution with configurable network policy.",
    details:
      "Backends: Vercel, Docker, just-bash, microsandbox. Default network is allow-all unless overridden — eve-analyst uses deny-all.",
    slot: "agent/sandbox.ts",
    helper: "defineSandbox",
  },
  {
    id: "channels",
    name: "Channels",
    status: "implemented",
    summary: "HTTP, Slack, Discord, Teams, Telegram, GitHub, Linear, and more.",
    details:
      "Platform ingress/egress adapters under agent/channels/. Root-only slot. Custom channels are supported.",
    slot: "agent/channels/<name>.ts",
    helper: "defineChannel",
  },
  {
    id: "connections",
    name: "Connections",
    status: "implemented",
    summary: "MCP and OpenAPI integrations as first-class slots.",
    details:
      "MCP fits under agent/connections/ — it does not define the whole agent repo. OpenAPI connections are also available.",
    slot: "agent/connections/<name>.ts",
    helper: "defineMcpClientConnection / defineOpenAPIConnection",
  },
  {
    id: "schedules",
    name: "Schedules",
    status: "implemented",
    summary: "Recurring autonomous jobs under agent/schedules/.",
    details:
      "Cron-style schedules for unattended work. Root-only slot. Gallery agents do not yet demonstrate schedules.",
    slot: "agent/schedules/<name>.ts",
    helper: "defineSchedule",
  },
  {
    id: "hooks-state",
    name: "Hooks & state",
    status: "implemented",
    summary: "Lifecycle subscribers and durable session state.",
    details:
      "defineHook for lifecycle/stream events; defineState for durable context. Instrumentation is a root-only slot.",
    slot: "agent/hooks/, agent/instrumentation.ts",
  },
  {
    id: "extensions",
    name: "Extensions",
    status: "implemented",
    summary: "Reusable npm capability packs mounted under extensions/.",
    details:
      "Package reusable tools/skills as extensions and mount them into an agent project.",
    helper: "defineExtension",
  },
  {
    id: "evals",
    name: "Evals",
    status: "implemented",
    summary: "Behavioral tests via defineEval + eve eval --strict.",
    details:
      "Evals live beside agent/, not inside it. They are a manual CI / pre-deploy gate — not auto-wired into eve deploy.",
    slot: "evals/*.eval.ts",
    helper: "defineEval",
  },
  {
    id: "cli",
    name: "CLI lifecycle",
    status: "implemented",
    summary: "init, info, dev, build, start, deploy, eval, channels.",
    details:
      "Recommended loop: edit → eve info → eve dev → eve build → eve start / eve deploy. Framework integrations for Next.js, Nuxt, and SvelteKit.",
  },
  {
    id: "self-host",
    name: "Self-host + Vercel",
    status: "implemented",
    summary: "eve build && eve start, or eve deploy to Vercel.",
    details:
      "Nitro builds .output/ for self-host or Vercel Build Output API. Durable local Workflow world under .eve/.workflow-data.",
  },
  {
    id: "warehouse-auth",
    name: "Warehouse + production auth templates",
    status: "roadmap",
    summary: "Production templates for warehouse adapters and auth.",
    details:
      "eve-analyst uses in-memory SQLite and intentional public demo auth (none()). Production templates are roadmap Phase 2.",
  },
];

export const channels = [
  { id: "eve", name: "eve HTTP", note: "Protocol under /eve/v1/*" },
  { id: "slack", name: "Slack", note: "Webhook + thread context" },
  { id: "discord", name: "Discord", note: "Platform channel" },
  { id: "teams", name: "Microsoft Teams", note: "Platform channel" },
  { id: "telegram", name: "Telegram", note: "Platform channel" },
  { id: "twilio", name: "Twilio", note: "Messaging" },
  { id: "github", name: "GitHub", note: "Repo events" },
  { id: "linear", name: "Linear", note: "Issue workflows" },
  { id: "chat-sdk", name: "Chat SDK", note: "Card-based UI" },
  { id: "custom", name: "Custom", note: "defineChannel" },
];

export const cliCommands = [
  {
    cmd: "eve init [target]",
    purpose: "Scaffold an agent or add eve to an existing project",
  },
  {
    cmd: "eve info [--json]",
    purpose: "Resolved surface + discovery diagnostics",
  },
  { cmd: "eve dev [url]", purpose: "Local server + TUI, or connect remote" },
  { cmd: "eve build", purpose: "Compile + host output" },
  { cmd: "eve start", purpose: "Serve .output/ for self-host" },
  { cmd: "eve deploy", purpose: "Vercel production deploy" },
  {
    cmd: "eve eval [--strict]",
    purpose: "Run behavioral evals (CI / pre-deploy gate)",
  },
  { cmd: "eve channels add|list", purpose: "Scaffold or list channels" },
  { cmd: "eve link", purpose: "Link Vercel project + pull env" },
];

export const builtInTools = [
  "bash",
  "read_file",
  "write_file",
  "glob",
  "grep",
  "web_fetch",
  "web_search",
  "todo",
  "ask_question",
  "agent",
  "load_skill",
  "connection_search",
];

export const comparisons = [
  {
    name: "LangChain",
    bestAt: "Broad orchestration primitives and integrations",
    difference:
      "Eve Agent Harness emphasizes a filesystem convention and compiler over code-first chains",
  },
  {
    name: "CrewAI",
    bestAt: "Role-based multi-agent collaboration",
    difference:
      "Subagents are folders inside the same compiled agent surface",
  },
  {
    name: "OpenAI Agents SDK",
    bestAt: "Tight OpenAI-native agent runtime",
    difference:
      "eve keeps provider/runtime wiring behind a folder-based project shape",
  },
  {
    name: "MCP",
    bestAt: "Standard tool-server protocol",
    difference:
      "MCP fits under agent/connections/; it does not define the whole agent repo",
  },
];
