# Agent Folder Convention

**Version:** 0.1.0  
**Status:** Adoptable draft  

This documents the folder grammar already implemented by eve. Use it when
creating, reviewing, or debugging an agent.

Implementation references:

- Layout docs: [`eve/docs/reference/project-layout.md`](../eve/docs/reference/project-layout.md)
- Discovery: [`eve/packages/eve/src/discover/`](../eve/packages/eve/src/discover/)
- Working example: [`eve-analyst/agent/`](../eve-analyst/agent/)
- Small examples: [`examples/`](../examples/)

---

## Rules

1. **An agent is a directory.** Prefer `my-agent/agent/...`.
2. **Identity comes from the path.** Do not add redundant `name` / `id` fields
   on `define*` calls. Example: `agent/tools/run_sql.ts` → tool `run_sql`.
3. **Evals live beside `agent/`, not inside it:** `my-agent/evals/`.
4. **Drop a file to add a capability.** Discovery and compilation wire it up.
5. **Subagents are nested agent packages** under `agent/subagents/<id>/` with
   their own slots; they do not inherit the parent's tools/skills.

---

## Minimal valid agent

```text
my-agent/
├── package.json
└── agent/
    └── instructions.md    # required on the root agent
```

Typical:

```text
my-agent/
├── package.json
├── agent/
│   ├── agent.ts           # model + runtime config
│   ├── instructions.md
│   └── tools/
│       └── hello.ts
└── evals/
    └── smoke.eval.ts
```

`agent.ts` can be as small as choosing a model — tools are not imported there.

---

## Recommended layout

```text
my-agent/
├── package.json
├── tsconfig.json
├── agent/
│   ├── agent.ts
│   ├── instructions.md        # or instructions.ts / instructions/
│   ├── instrumentation.ts     # root-only telemetry
│   ├── channels/              # root-only
│   ├── connections/
│   ├── hooks/
│   ├── skills/
│   ├── lib/                   # import-only helpers (not mounted to sandbox)
│   ├── sandbox.ts             # or sandbox/sandbox.ts + sandbox/workspace/**
│   ├── tools/
│   ├── schedules/             # root-only
│   └── subagents/
│       └── researcher/
│           ├── agent.ts       # required; must include description
│           ├── instructions.md
│           ├── tools/
│           └── skills/
└── evals/
    ├── evals.config.ts
    └── example.eval.ts
```

Flat layout (app root == agent root) works, but the nested layout is easier to
read once the agent has tools, evals, and app code.

---

## Slot table

| Path | Required | Subagents | Description |
|------|----------|-----------|-------------|
| `agent.ts` | Recommended | Yes | Model / compaction / build / experimental |
| `instructions.md` (or `.ts` / dir) | **Yes (root)** | Optional | Always-on system prompt |
| `instrumentation.ts` | No | No | Telemetry; root-only |
| `channels/` | No | No | HTTP / messaging entrypoints; root-only |
| `connections/` | No | Yes | MCP / OpenAPI connections |
| `hooks/` | No | Yes | Lifecycle / stream subscribers |
| `skills/` | No | Yes | On-demand procedures |
| `lib/` | No | Yes | Shared authored code (import-only) |
| `sandbox.ts` / `sandbox/` | No | Yes | Sandbox backend + optional workspace seed |
| `tools/` | No | Yes | Typed executable tools |
| `schedules/` | No | No | Cron jobs; root-only |
| `subagents/<id>/` | No | Yes (nested) | Specialist child agents |
| `../evals/` | No | — | Behavioral evals at app root |

---

## Naming examples

| Path | Resolves to |
|------|-------------|
| `agent/tools/get_weather.ts` | tool `get_weather` |
| `agent/skills/revenue-rules.md` | skill `revenue-rules` |
| `agent/connections/linear.ts` | connection `linear` |
| `agent/subagents/investigator/agent.ts` | subagent `investigator` |
| `agent/schedules/weekly_recap.ts` | schedule `weekly_recap` |

Root agent display name comes from `package.json` `name`, else directory name.

---

## Relation to other standards

| Standard | Relationship |
|----------|--------------|
| **MCP** | Complementary. MCP servers are authored as connections under `connections/`. |
| **A2A** | Out of scope here; this doc focuses on agent structure and runtime. |
| **Knowledge-base layouts (e.g. OKF-style)** | Separate concern. This convention covers agent primitives, not giant markdown wikis. |
| **Coding-agent skills** | Similar “drop a file” UX; eve extends it to deployed durable agents. |

The point of this file is practical consistency. A human or coding agent should
be able to open an agent folder and know where each capability belongs.

## Versioning

This convention follows semver:

- Patch: wording clarifications that do not change folder meaning.
- Minor: new optional slots or examples.
- Major: changes that move required files or break existing agents.

Version `0.1.0` documents the current eve folder grammar used by this repo. It
is stable enough to copy, but still tied to eve's pre-1.0 framework surface.

---

## Debugging discovery

```bash
pnpm exec eve info    # discovered surface + diagnostics
```

Inspect compiled artifacts under `.eve/`. If a file is missing from the
runtime, check the slot table and root-vs-subagent boundaries first.

---

## See also

- [`FRAMEWORK_SPEC.md`](./FRAMEWORK_SPEC.md)
- [`eve/docs/reference/project-layout.md`](../eve/docs/reference/project-layout.md)
- [`eve-analyst/README.md`](../eve-analyst/README.md)
