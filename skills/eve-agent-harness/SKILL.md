---
name: eve-agent-harness
description: Build and extend filesystem-first eve agents in Eve Agent Harness. Use when adding tools, skills, subagents, channels, evals, or new reference agents.
---

# Eve Agent Harness

Use this skill when working in this repository.

## Read first

1. `README.md` — product shape and quick starts.
2. `docs/AGENT_CONVENTION.md` — versioned folder convention.
3. `docs/FRAMEWORK_SPEC.md` — current vs. planned capabilities.
4. Installed eve docs at `node_modules/eve/docs/` when editing agent code.

## Repository map

- `eve/` — framework source and CLI.
- `eve-analyst/` — flagship data analyst reference.
- `examples/support-agent/` — support triage starter.
- `examples/research-agent/` — research brief starter.
- `examples/ops-agent/` — ops/SRE triage starter.

## How to add a capability

- Tool: add `agent/tools/<name>.ts` exporting `defineTool(...)`.
- Skill: add `agent/skills/<name>.md` with frontmatter `description`.
- Subagent: add `agent/subagents/<id>/agent.ts` with `description`.
- Eval: add `evals/<name>.eval.ts` at the app root.
- Channel: add `agent/channels/<name>.ts`.

Do not manually import tools, skills, or subagents into `agent.ts`. The compiler
discovers them from the folder layout.

## Safety checks

- Add approval policies for risky tools.
- Remove demo-only anonymous auth (`none()`) before production.
- Set sandbox network policy explicitly for code execution.
- Run the narrowest relevant command before finishing:
  - `pnpm demo:analyst`
  - `pnpm --dir <agent> typecheck`
  - `pnpm --dir <agent> exec eve eval --strict`
