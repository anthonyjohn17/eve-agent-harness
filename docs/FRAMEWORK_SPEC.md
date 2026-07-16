# Eve Agent Harness — Framework Spec

This is the working spec for the repo. It defines what the harness is, what is
implemented today, and what should stay out of scope for now. Keep it aligned
with [`eve/packages/eve/`](../eve/packages/eve/), the reference agent in
[`eve-analyst/`](../eve-analyst/), and the gallery in [`examples/`](../examples/).

Companion: [`AGENT_CONVENTION.md`](./AGENT_CONVENTION.md) (folder slots).

---

## 1. Vision

Build production-shaped AI agents as normal repo artifacts: folders of Markdown
and TypeScript that compile into durable runtimes.

The reference case is `eve-analyst/`: schema tools, business-rule skills,
approval on risky SQL, sandbox analysis, investigator subagents, HTTP + Slack,
and evals. The smaller gallery agents show the same folder convention applied
to support, research, and ops/SRE work.

---

## 2. Who this is for

| Persona | Need |
|---------|------|
| Agent builders | Ship domain agents without hand-wiring a runtime |
| Platform / product engineers | Durable sessions, channels, sandbox, auth, deploy paths |
| Coding agents (Cursor, Claude Code, …) | Predictable folder grammar + local docs |
| Framework contributors | Clear package boundaries under `eve/packages/eve` |

---

## 3. Goals and non-goals

### Goals

- Filesystem-first authoring with path-derived identity.
- Automatic discovery and compilation (no central tool registry edits).
- Production primitives as first-class slots: tools, skills, HITL, sandbox,
  channels, connections, schedules, subagents, evals, durable sessions.
- A runnable reference agent (`eve-analyst`) that exercises those primitives.
- A small gallery of copyable reference agents for other domains.
- Self-host path (`eve build` / `eve start`) in addition to Vercel deploy.
- Honest documentation: distinguish implemented vs. roadmap.

### Non-goals

- Replacing MCP, A2A, or knowledge-base standards (OKF-style wikis).
- Claiming to scale “millions of users” without published load evidence.
- Auto-running evals inside `eve deploy` (today: run `eve eval --strict` in CI).
- Shipping a giant markdown knowledge base as part of the agent core.
- Renaming the public `eve` package without an explicit publish/migration plan.

---

## 4. Terminology

| Term | Meaning |
|------|---------|
| **eve** | The TypeScript framework / npm package / CLI |
| **Eve Agent Harness** | This repository |
| **Agent** | An authored directory tree under `agent/` (or flat layout) |
| **Slot** | A conventional path (`tools/`, `skills/`, …) with defined semantics |
| **Discovery** | Walking the tree and collecting authored definitions |
| **Compilation** | Normalizing definitions into `.eve/` artifacts / manifest |
| **Harness** | The model tool-loop that executes one unit of AI work |
| **Session / Turn / Step** | Durable execution nesting (Workflow-backed) |
| **Channel** | Ingress/egress adapter (HTTP, Slack, …) |
| **HITL** | Human-in-the-loop tool approval / parked input |
| **Eval** | Behavioral test via `defineEval` + `eve eval` |

---

## 5. Runtime shape

```text
Authoring (agent/)  →  discoverAgent  →  compileAgent (.eve/)
                                              ↓
                         Nitro host + Workflow durable runtime
                                              ↓
                    Channels ←→ Session/Turn/Step ←→ Tool-loop harness
                                              ↓
                         Sandbox / Connections / Subagents / HITL
```

Source pointers:

- Discovery: `eve/packages/eve/src/discover/discover-agent.ts`
- Compilation: `eve/packages/eve/src/compiler/compile-agent.ts`
- Tool loop: `eve/packages/eve/src/harness/tool-loop.ts`
- Durability: `eve/packages/eve/src/execution/` + docs under
  `eve/docs/concepts/execution-model-and-durability.md`
- Channel dispatch: `eve/packages/eve/src/internal/nitro/routes/channel-dispatch.ts`

---

## 6. Primitive contract

| Primitive | Authoring | Helper | Runtime role |
|-----------|-----------|--------|--------------|
| Agent config | `agent/agent.ts` | `defineAgent` | Model, limits, compaction, build |
| Instructions | `instructions.md` / `.ts` | `defineInstructions` | Always-on system prompt |
| Tools | `tools/<name>.ts` | `defineTool` | Typed model-callable functions + optional `approval` |
| Skills | `skills/<name>.md\|.ts` | `defineSkill` | On-demand procedures |
| Subagents | `subagents/<id>/` | `defineAgent` + `description` | Delegated specialists |
| Channels | `channels/<name>.ts` | `eveChannel`, `slackChannel`, … | Message ingress/delivery |
| Connections | `connections/<name>.ts` | `defineMcpClientConnection`, OpenAPI | External tool servers |
| Sandbox | `sandbox.ts` | `defineSandbox` | Isolated code execution |
| Schedules | `schedules/<name>.ts\|.md` | `defineSchedule` | Cron autonomous turns |
| Hooks | `hooks/<slug>.ts` | `defineHook` | Lifecycle / stream subscribers |
| State | authored state modules | `defineState` | Durable per-session memory |
| Extensions | `extensions/` + packages | `defineExtension` | Reusable npm capability packs |
| Evals | `evals/*.eval.ts` | `defineEval` | Behavioral regression suite |

Full slot table: [`AGENT_CONVENTION.md`](./AGENT_CONVENTION.md).

---

## 7. Reference agents

`eve-analyst` is the reference implementation:

1. User asks a natural-language analytics question (HTTP TUI / Slack).
2. Agent loads `revenue-rules` skill when the question concerns revenue/growth.
3. Tools discover schema (`list_tables`, `describe_table`) and run read-only SQL.
4. Expensive scans trigger HITL approval on the primary `run_sql` tool.
5. Deeper crunching uses `run_analysis` inside a deny-all-network sandbox.
6. Open-ended “why” questions can delegate to `investigator` subagent.
7. Evals under `evals/` assert skill use, approval, schema, counts, delegation.

Boundaries:

- SQL is read-only by construction (`agent/lib/sql-guard.ts`).
- Sandbox network policy is `deny-all` (`agent/sandbox.ts`).
- HTTP channel includes `none()` for the public demo — **not** a production default.

Gallery agents:

| Agent | Purpose | Included primitives |
|-------|---------|---------------------|
| `examples/support-agent` | Customer support triage | instructions, support skill, ticket lookup tool |
| `examples/research-agent` | Source-grounded research briefs | instructions, source-quality skill, source search tool |
| `examples/ops-agent` | Service-health triage | instructions, incident skill, service check tool |

---

## 8. Current vs. planned

### Implemented today

- Filesystem authoring + discovery + compilation
- Durable sessions / HITL pause-resume
- Tools, skills, subagents, channels, connections, schedules, sandbox backends
- `eve` CLI: `init`, `dev`, `build`, `start`, `eval`, `deploy`, `channels`, …
- Framework integrations: Next.js, Nuxt, SvelteKit
- Reference analyst agent with unit tests + evals
- Reference gallery for support, research, and ops/SRE agents
- Self-host path documented in eve deployment docs

### Planned

| Phase | Items |
|-------|-------|
| 1 | Root CI for the harness; link `eve-analyst` to local `eve/` package version |
| 2 | Production auth template; warehouse adapter; schedule example; glossary `defineState`; web UI |
| 3 | Real eval suites for the gallery examples |
| 4 | Self-host CI matrix; release automation under this repo's namespaces |

---

## 9. Acceptance criteria

A docs/product change is done when:

1. Root README still leads with the folder-tree mental model and honest claims.
2. `eve-analyst` still runs with documented commands (or documented breakage).
3. Specs do not claim unimplemented automatic deploy-time eval gating.
4. Apache-2.0 `LICENSE` + `NOTICE` remain present and accurate.
5. No runtime behavior changes are introduced by docs-only passes.

---

## 10. Compatibility

- **Pre-1.0 / preview:** prefer correctness over backwards compatibility in the
  framework tree, matching upstream eve posture.
- **This distribution** may rebrand docs and maintainer metadata without
  renaming the `eve` package or public import paths in the same pass.
- Breaking renames of packages, container images, or public exports require an
  explicit migration plan outside a docs/rebrand PR.

---

## 11. Related documents

- [`../README.md`](../README.md)
- [`../AGENTS.md`](../AGENTS.md)
- [`AGENT_CONVENTION.md`](./AGENT_CONVENTION.md)
- [`../eve-analyst/SPEC.md`](../eve-analyst/SPEC.md)
- [`../eve/docs/`](../eve/docs/)
