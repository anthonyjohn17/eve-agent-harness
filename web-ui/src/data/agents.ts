export type AgentShowcase = {
  id: string;
  name: string;
  path: string;
  role: string;
  summary: string;
  demoCommand: string;
  prompts: string[];
  primitives: string[];
  notes: string[];
  scope: "flagship" | "gallery";
};

export const agents: AgentShowcase[] = [
  {
    id: "eve-analyst",
    name: "eve-analyst",
    path: "eve-analyst/",
    role: "Flagship data analyst",
    summary:
      "Ask questions about a company's data in plain English. Writes read-only SQL, follows revenue rules, guards expensive queries behind human approval, runs Python in an isolated sandbox, and delegates open-ended investigations to a subagent.",
    demoCommand: "ANTHROPIC_API_KEY=sk-ant-... pnpm demo:analyst",
    prompts: [
      "What tables are in the warehouse?",
      "What was our total revenue?",
      "Run this exact query: SELECT * FROM order_items",
      "Use run_analysis to print 6*7",
      "Revenue dropped last week, why?",
      "Delete every row in the orders table",
    ],
    primitives: [
      "4 SQL / analysis tools",
      "revenue-rules skill",
      "HITL approval on expensive scans",
      "deny-all sandbox network",
      "investigator subagent",
      "HTTP + Slack channels",
      "5 real evals",
      "In-memory SQLite warehouse",
    ],
    notes: [
      "Ground-truth net revenue: $17,057.90 (test accounts excluded).",
      "Week 8 has an intentional revenue dip for investigator demos.",
      "HTTP channel includes none() for the public demo — remove for production.",
      "Inspired by production Slack analyst patterns; does not contain or replace d0.",
    ],
    scope: "flagship",
  },
  {
    id: "support-agent",
    name: "support-agent",
    path: "examples/support-agent/",
    role: "Customer support triage",
    summary:
      "Minimal gallery agent with a support playbook skill and ticket lookup tool. Intentionally small for copyability.",
    demoCommand: "ANTHROPIC_API_KEY=sk-ant-... pnpm demo:support",
    prompts: [
      "Please triage SUP-1001.",
      "A customer says exports fail on large workspaces. What should support do next?",
    ],
    primitives: [
      "instructions.md",
      "support-playbook skill",
      "lookup_ticket tool",
      "evals placeholder",
    ],
    notes: [
      "Mock tickets only (e.g. SUP-1001 Northwind Analytics).",
      "No subagents, sandbox, or channels beyond default eve dev.",
      "Real eval suites are roadmap Phase 3.",
    ],
    scope: "gallery",
  },
  {
    id: "research-agent",
    name: "research-agent",
    path: "examples/research-agent/",
    role: "Source-grounded research",
    summary:
      "Produces briefs grounded in bundled source memos with a source-quality skill.",
    demoCommand: "ANTHROPIC_API_KEY=sk-ant-... pnpm demo:research",
    prompts: [
      "Research why folder-based agents are easier to maintain.",
      "What evidence supports evals as a pre-deploy habit?",
    ],
    primitives: [
      "instructions.md",
      "source-quality skill",
      "search_sources tool",
      "evals placeholder",
    ],
    notes: [
      "Bundled memos describe eve harness concepts themselves.",
      "Cite source ids; show uncertainty — per skill rules.",
    ],
    scope: "gallery",
  },
  {
    id: "ops-agent",
    name: "ops-agent",
    path: "examples/ops-agent/",
    role: "Ops / SRE incident triage",
    summary:
      "Checks synthetic service health and applies incident-triage rules — stabilize first, recommend rollback on deploy correlation.",
    demoCommand: "ANTHROPIC_API_KEY=sk-ant-... pnpm demo:ops",
    prompts: [
      "Check the api service and recommend next steps.",
      "Is workers healthy? Give me the short incident summary.",
    ],
    primitives: [
      "instructions.md",
      "incident-triage skill",
      "check_service tool",
      "evals placeholder",
    ],
    notes: [
      "Synthetic health: api degraded, workers healthy.",
      "Not a live monitoring integration.",
    ],
    scope: "gallery",
  },
];

export const analystDataset = [
  {
    table: "customers",
    detail: "14 rows; ids 11–12 are test accounts (is_test=1)",
  },
  {
    table: "products",
    detail: "10 products across Widgets, Gadgets, Gizmos, Accessories",
  },
  {
    table: "orders",
    detail: "~96 orders across 8 weeks; paid / fulfilled / cancelled",
  },
  { table: "order_items", detail: "Line items with unit_price_cents" },
  { table: "refunds", detail: "~10% refund rate on non-cancelled orders" },
];

export const analystEvals = [
  {
    file: "schema.eval.ts",
    asserts: "Calls list_tables; message mentions customers",
  },
  {
    file: "revenue.eval.ts",
    asserts: "Loads revenue-rules; calls run_sql",
  },
  {
    file: "approval.eval.ts",
    asserts: "SELECT * FROM order_items parks for user approval",
  },
  {
    file: "count.eval.ts",
    asserts: "Filtered aggregate via run_sql",
  },
  {
    file: "delegate.eval.ts",
    asserts: "Calls investigator subagent",
  },
];
