export type DemoBeat = {
  id: string;
  label: string;
  user: string;
  events: DemoEvent[];
};

export type DemoEvent =
  | { kind: "thinking"; text: string }
  | { kind: "tool"; name: string; input?: string; output: string }
  | { kind: "skill"; name: string }
  | { kind: "subagent"; name: string; summary: string }
  | { kind: "approval"; reason: string; sql: string }
  | { kind: "assistant"; text: string };

export const demoBeats: DemoBeat[] = [
  {
    id: "schema",
    label: "Schema discovery",
    user: "What tables are in the warehouse?",
    events: [
      {
        kind: "thinking",
        text: "Start with schema discovery before writing SQL.",
      },
      {
        kind: "tool",
        name: "list_tables",
        input: "{}",
        output: JSON.stringify(
          {
            tables: [
              "customers",
              "products",
              "orders",
              "order_items",
              "refunds",
            ],
          },
          null,
          2,
        ),
      },
      {
        kind: "assistant",
        text: "The warehouse has five tables: customers, products, orders, order_items, and refunds. I can describe any of them next.",
      },
    ],
  },
  {
    id: "revenue",
    label: "Revenue + rules",
    user: "What was our total revenue?",
    events: [
      {
        kind: "thinking",
        text: "Revenue questions require the revenue-rules skill before SQL.",
      },
      { kind: "skill", name: "revenue-rules" },
      {
        kind: "tool",
        name: "run_sql",
        input:
          "SELECT SUM(oi.unit_price_cents * oi.quantity) - COALESCE(SUM(r.amount_cents),0) AS net_cents ... (paid/fulfilled, exclude is_test)",
        output: JSON.stringify(
          { rows: [{ net_revenue_dollars: 17057.9 }], rowCount: 1 },
          null,
          2,
        ),
      },
      {
        kind: "assistant",
        text: "Net revenue is $17,057.90 — paid/fulfilled orders only, refunds subtracted, test accounts excluded (per revenue-rules).",
      },
    ],
  },
  {
    id: "approval",
    label: "HITL approval",
    user: "Run this exact query: SELECT * FROM order_items",
    events: [
      {
        kind: "thinking",
        text: "No WHERE or LIMIT — looksExpensive() returns true. Park for approval.",
      },
      {
        kind: "approval",
        reason: "Full table scan without WHERE or LIMIT",
        sql: "SELECT * FROM order_items",
      },
      {
        kind: "assistant",
        text: "This query is parked awaiting human approval. After approve, the same durable session resumes and returns up to 200 rows.",
      },
    ],
  },
  {
    id: "sandbox",
    label: "Sandbox analysis",
    user: "Use run_analysis to print 6*7",
    events: [
      {
        kind: "thinking",
        text: "Run Python in the sandbox with deny-all network policy.",
      },
      {
        kind: "tool",
        name: "run_analysis",
        input: 'print(6 * 7)',
        output: JSON.stringify(
          { stdout: "42\n", stderr: "", exitCode: 0 },
          null,
          2,
        ),
      },
      {
        kind: "assistant",
        text: "Sandbox returned 42. Network egress is deny-all — analysis stays isolated.",
      },
    ],
  },
  {
    id: "investigate",
    label: "Subagent investigate",
    user: "Revenue dropped last week, why?",
    events: [
      {
        kind: "thinking",
        text: "Open-ended investigation → delegate to investigator with a fresh context.",
      },
      {
        kind: "subagent",
        name: "investigator",
        summary:
          "Compared weekly order volume: week 8 has 6 orders vs ~15 prior. Dip is volume-driven, not refund-rate spike.",
      },
      {
        kind: "assistant",
        text: "Investigator findings: last week’s dip is mostly fewer paid/fulfilled orders (6 vs ~15). Refund rate did not spike. Recommend checking demand or fulfillment capacity for week 8.",
      },
    ],
  },
  {
    id: "refuse",
    label: "Write refusal",
    user: "Delete every row in the orders table",
    events: [
      {
        kind: "thinking",
        text: "Write SQL is rejected by the read-only SQL guard.",
      },
      {
        kind: "tool",
        name: "run_sql",
        input: "DELETE FROM orders",
        output: JSON.stringify(
          {
            ok: false,
            error: "Only read-only SELECT statements are allowed",
          },
          null,
          2,
        ),
      },
      {
        kind: "assistant",
        text: "I can’t delete data. The warehouse tools are read-only — mutations are blocked by the SQL guard.",
      },
    ],
  },
];
