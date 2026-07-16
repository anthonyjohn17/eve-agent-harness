# Eve Agent Harness

**An AI agent is a folder.**

Eve Agent Harness is my standalone open-source workspace for building durable,
production-shaped AI agents with the filesystem-first **eve** framework.
It is maintained by [John Anthony](https://github.com/anthonyjohn17).

Drop a tool into `tools/`. Drop a skill into `skills/`. Drop a subagent into
`subagents/`. The framework discovers and compiles them. No central registry,
no manual wiring.

```text
agent/
├── agent.ts            # Model + runtime config
├── instructions.md     # Always-on system prompt (the agent's persona)
├── tools/              # Typed functions the model can call
├── skills/             # Procedures loaded on demand (business rules, playbooks)
├── channels/           # How users reach the agent (HTTP, Slack, Discord, …)
├── subagents/          # Specialist workers the main agent can delegate to
├── schedules/          # Recurring autonomous jobs
├── connections/        # MCP / OpenAPI integrations
├── sandbox.ts          # Isolated code execution policy
└── (sibling) evals/    # Behavioral tests that gate shipping
```

That tree is the pitch.

---

## Why this exists

Most agent frameworks make you assemble the runtime in code: import tools,
register skills, wire channels, and hand-roll approval flows. This repo keeps
the runtime shape in the filesystem:

> **Authoring is the filesystem. Compilation is the framework.**

The result is an agent you can inspect like a normal repo, edit with a coding
agent, test before deploy, and run over HTTP or Slack with durable sessions
that survive approvals and restarts.

The flagship proof is [`eve-analyst/`](./eve-analyst/) — a complete data
analyst agent (SQL tools, revenue skills, human approval, sandbox Python,
investigator subagent, eval suite) that runs offline on an in-memory warehouse.

---

## The compiler

In typical agent SDKs you wire every capability by hand:

```ts
// Other frameworks: every tool/skill must be imported and registered
const agent = new Agent({
  tools: [listTables, describeTable, runSql, runAnalysis],
  skills: [revenueRules],
  subagents: [investigator],
});
```

Here, `agent.ts` stays tiny — discovery + compilation do the wiring:

```ts
// eve: drop files into folders; the compiler finds them
import { defineAgent } from "eve";
import { anthropic } from "@ai-sdk/anthropic";

export default defineAgent({
  model: anthropic("claude-sonnet-5"),
});
```

Under the hood, eve walks `agent/`, builds a manifest under `.eve/`, and
connects tools, skills, channels, subagents, schedules, and connections
automatically. See [`eve/packages/eve/src/discover/`](./eve/packages/eve/src/discover/)
and [`eve/packages/eve/src/compiler/`](./eve/packages/eve/src/compiler/).

---

## One-command demo

Node **24+** and **pnpm** required. An Anthropic API key is required for the model.

```bash
ANTHROPIC_API_KEY=sk-ant-... pnpm demo:analyst
```

Then ask in the TUI:

- *What tables are in the warehouse?*
- *What was our total revenue?*
- *Run this exact query:* `SELECT * FROM order_items` (triggers human approval)
- *Revenue dropped last week, why?* (delegates to the investigator subagent)

That command installs `eve-analyst` dependencies and starts the eve dev TUI.
Full walkthrough: [`eve-analyst/README.md`](./eve-analyst/README.md).

---

## Repository map


| Path                                                       | Role                                                                    |
| ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| [`eve/`](./eve/)                                           | Framework monorepo — publishable `eve` package, CLI, docs, e2e fixtures |
| [`eve-analyst/`](./eve-analyst/)                           | Flagship reference agent — production-shaped data analyst               |
| [`examples/`](./examples/)                                 | Small support, research, and ops/SRE reference agents                   |
| [`docs/`](./docs/)                                         | Product + convention specs for this distribution                        |
| [`eve-ai-agent-frameowrk.md`](./eve-ai-agent-framework.md) | Background research notes (non-authoritative)                           |
| [`AGENTS.md`](./AGENTS.md)                                 | Guidance for coding agents working in this repo                         |
| [`skills/eve-agent-harness/`](./skills/eve-agent-harness/) | Skill-style instructions for coding agents                              |


This distribution keeps the technical framework name `eve` (package, CLI,
imports) for compatibility. **Eve Agent Harness** is the name of this
repository and packaging.

---

## How this compares

| Project / standard | Best at | Difference here |
|--------------------|---------|-----------------|
| LangChain | Broad orchestration primitives and integrations | Eve Agent Harness emphasizes a filesystem convention and compiler over code-first chains |
| CrewAI | Role-based multi-agent collaboration | Subagents are folders inside the same compiled agent surface |
| OpenAI Agents SDK | Tight OpenAI-native agent runtime | eve keeps provider/runtime wiring behind a folder-based project shape |
| MCP | Standard tool-server protocol | MCP fits under `agent/connections/`; it does not define the whole agent repo |
| eve / this repo | Durable backend agents you can inspect, test, and deploy | Tools, skills, channels, subagents, sandbox, schedules, and evals live as files |

The point is not to replace every agent SDK. The point is to make the agent
itself easy to inspect and extend: filesystem convention + compiler +
production primitives.

---

## Reference agents

The analyst is the full reference. The gallery gives smaller starting points
for other domains.

| Agent | What it proves | Run |
|-------|----------------|-----|
| [`eve-analyst`](./eve-analyst/) | Data analysis, SQL tools, HITL approval, sandbox Python, subagent, evals | `ANTHROPIC_API_KEY=... pnpm demo:analyst` |
| [`support-agent`](./examples/support-agent/) | Support triage with a policy skill and ticket lookup tool | `ANTHROPIC_API_KEY=... pnpm demo:support` |
| [`research-agent`](./examples/research-agent/) | Source-grounded briefs with a quality skill and source search tool | `ANTHROPIC_API_KEY=... pnpm demo:research` |
| [`ops-agent`](./examples/ops-agent/) | Incident triage with service-health lookup and SRE rules | `ANTHROPIC_API_KEY=... pnpm demo:ops` |

Each gallery agent is intentionally small: `agent.ts`, `instructions.md`,
one skill, one tool, and an `evals/` placeholder. The point is copyability.

---

## Capability matrix


| Capability                                    | Status      | Notes                                                                                |
| --------------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| Filesystem authoring (`agent/`)               | Implemented | Path-derived names; no redundant `name` fields                                       |
| Discovery + compilation                       | Implemented | Writes inspectable `.eve/` artifacts                                                 |
| Typed tools + Zod                             | Implemented | `defineTool` under `agent/tools/`                                                    |
| Human-in-the-loop approval                    | Implemented | Tool `approval` policies; durable pause/resume                                       |
| Skills (on-demand procedures)                 | Implemented | Markdown or TypeScript under `agent/skills/`                                         |
| Subagents                                     | Implemented | Nested `agent/subagents/<id>/` directories                                           |
| Sandbox backends                              | Implemented | Vercel / Docker / just-bash / microsandbox                                           |
| Channels                                      | Implemented | HTTP (`eve`), Slack, Discord, Teams, Telegram, GitHub, Linear, …                     |
| Connections (MCP / OpenAPI)                   | Implemented | `agent/connections/`                                                                 |
| Schedules                                     | Implemented | Cron jobs under `agent/schedules/`                                                   |
| Evals                                         | Implemented | `eve eval --strict` as a **CI / pre-deploy gate** (not auto-wired into `eve deploy`) |
| Self-host (`eve build && eve start`)          | Implemented | Documented; Vercel is also supported                                                 |
| Example gallery beyond analyst                | Implemented | Support / research / ops agents under `examples/`                                    |
| Warehouse adapter + production auth templates | Roadmap     | Analyst demo uses SQLite + intentional public demo auth                              |


**Notes:** the framework is pre-1.0 / preview-quality; APIs may change. Default
sandbox network and omitted approvals are permissive, so configure safeguards
explicitly for production. See
[`eve/docs/responsible-use.md`](./eve/docs/responsible-use.md).

---

## Quick starts



### Build an agent (application path)

```bash
# Option A — run the full analyst reference
ANTHROPIC_API_KEY=sk-ant-... pnpm demo:analyst

# Option B — start from a small reference agent
cp -R examples/support-agent my-agent && cd my-agent
pnpm install && pnpm dev

# Option C — scaffold with the published CLI
npx eve@latest init my-agent
```



### Work on the framework (contributor path)

```bash
cd eve
pnpm install
pnpm build
pnpm dev          # watch framework + weather-agent fixture
pnpm test:unit    # fast feedback
```

Specs for the product vision and folder convention:

- [`docs/FRAMEWORK_SPEC.md`](./docs/FRAMEWORK_SPEC.md)
- [`docs/AGENT_CONVENTION.md`](./docs/AGENT_CONVENTION.md)

---

## Validation

```bash
# Analyst
cd eve-analyst && pnpm typecheck && node --test test/*.test.ts
pnpm exec eve eval --strict   # needs ANTHROPIC_API_KEY

# Framework (after pnpm install && pnpm build in eve/)
cd eve && pnpm lint && pnpm typecheck && pnpm test:unit
```

---

## Roadmap

1. **Unify CI** at the harness root; wire `eve-analyst` and examples to the local `eve/` package.
2. **Production templates** — auth, warehouse adapter, schedules, durable glossary state, web UI.
3. **Eval coverage for the gallery** — promote the example eval placeholders into real eval suites.
4. **Self-host polish** — documented Docker + Postgres workflow world; release automation under this repo's package/container namespaces.

---

## Attribution & license

The `eve/` framework tree is derived from the upstream open-source **eve**
project (Apache-2.0).

- License: [Apache License 2.0](./LICENSE)
- Notices: [NOTICE](./NOTICE)
- See also [`eve/LICENSE`](./eve/LICENSE) and [`eve/NOTICE`](./eve/NOTICE)

Upstream technical docs and the published npm package remain useful references:
[eve.dev/docs](https://eve.dev/docs) · [npm](https://www.npmjs.com/package/eve) `eve`.

Vercel is retained in this repository where it names a **platform**,
**deployment target**, **package**, or **upstream source** — not as the owner
of this distribution.