# AGENTS.md

Guidance for coding agents and humans working in **Eve Agent Harness**.

Always style the framework name as `eve` (lowercase) in code, docs, prompts,
comments, and headings. Style this distribution as **Eve Agent Harness**.

## What this repository is

A two-part workspace:

| Path | Role |
|------|------|
| `eve/` | Framework monorepo: CLI, runtime, docs, fixtures, e2e |
| `eve-analyst/` | Reference data analyst agent that consumes the `eve` package |
| `examples/` | Small reference agents: support, research, ops/SRE |
| `docs/` | Product spec and agent-folder convention |
| `skills/eve-agent-harness/SKILL.md` | Skill-style instructions for coding agents |
| `Eve-AI-Agent-Framework.md` | Background research notes — **not** authoritative |

There is no pnpm workspace linking the two trees yet. `eve-analyst` depends on
the published `eve` npm package unless you deliberately link a local build.

## Source of truth

When writing or editing eve agent code, prefer the docs that ship with the
installed package:

```text
node_modules/eve/docs/
```

Fallback: `eve/docs/` in this repo (framework source) or https://eve.dev/docs.

Repo-level docs:

- [`README.md`](./README.md) — vision and quick start
- [`docs/FRAMEWORK_SPEC.md`](./docs/FRAMEWORK_SPEC.md) — product contract
- [`docs/AGENT_CONVENTION.md`](./docs/AGENT_CONVENTION.md) — folder slots
- [`skills/eve-agent-harness/SKILL.md`](./skills/eve-agent-harness/SKILL.md) — compact agent-building instructions

## Rules that matter

1. An agent is a directory under `agent/`.
2. Identity comes from the path. Do not add redundant `name` / `id` fields to `define*` calls.
3. Do not manually register tools, skills, or subagents in `agent.ts`; discovery handles it.
4. Keep production behavior explicit: auth, approval, sandbox network, evals.

## Extending or scaffolding an agent

### Use `eve-analyst` as the reference

```text
eve-analyst/
├── agent/
│   ├── agent.ts              # defineAgent({ model })
│   ├── instructions.md
│   ├── tools/*.ts            # defineTool
│   ├── skills/*.md
│   ├── channels/*.ts
│   ├── sandbox.ts
│   ├── subagents/<id>/       # nested agent package
│   └── lib/                  # shared helpers (import-only)
└── evals/*.eval.ts           # defineEval — sibling of agent/, not inside it
```

### Add a capability

| Goal | Action |
|------|--------|
| New tool | Add `agent/tools/<name>.ts` exporting `defineTool(...)` |
| New skill | Add `agent/skills/<name>.md` (frontmatter description + body) |
| New subagent | Add `agent/subagents/<id>/agent.ts` with required `description` |
| New channel | Add `agent/channels/<name>.ts` |
| New schedule | Add `agent/schedules/<name>.ts` with `defineSchedule` |
| New eval | Add `evals/<name>.eval.ts` with `defineEval` |

Keep `agent.ts` small. It is for model and runtime config, not capability wiring.

### Scaffold a new agent

```bash
npx eve@latest init my-agent
# or copy eve-analyst and strip domain-specific tools/skills
```

### Start from the gallery

```bash
cp -R examples/support-agent my-support-agent
cp -R examples/research-agent my-research-agent
cp -R examples/ops-agent my-ops-agent
```

## Commands

### Analyst (`eve-analyst/`)

```sh
ANTHROPIC_API_KEY=sk-ant-... pnpm demo:analyst
cd eve-analyst
pnpm typecheck
node --test test/*.test.ts
pnpm exec eve eval --strict       # needs ANTHROPIC_API_KEY
pnpm build && pnpm start
```

### Framework (`eve/`)

```sh
cd eve
pnpm install
pnpm build
pnpm dev                          # framework watch + weather-agent
pnpm lint && pnpm typecheck
pnpm test:unit                    # prefer this for fast feedback
pnpm test:integration             # when behavior needs it
pnpm docs:check
```

Do not run the full scenario/e2e matrix after every docs-only change. Prefer
the narrowest relevant check.

## Framework code principles

When changing `eve/packages/eve`:

1. Public APIs need docs and tests.
2. Prefer small modules with narrow responsibilities.
3. Wrap third-party APIs; do not re-export them as eve public surface.
4. Pre-1.0: prefer correctness over backwards compatibility.
5. Derive names from file paths.
6. Comment why, not what.

See also `eve/AGENTS.md` for framework-specific invariants and test tiers.

## Safety defaults

- Omitting tool `approval` means no human gate.
- Sandbox network default is allow-all unless overridden (`deny-all` in eve-analyst).
- The analyst HTTP channel includes `none()` for the public demo — remove it for real deployments.
- Evals are a **manual / CI gate** (`eve eval --strict`), not automatically run by `eve deploy`.

## Avoid

- Do not claim ownership of the upstream npm `eve` package namespace without a deliberate publish plan.
- Do not delete `LICENSE` / `NOTICE` or strip Apache-2.0 provenance.
- Do not invent features in docs that are not implemented — mark roadmap items clearly.
