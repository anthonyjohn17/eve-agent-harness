# Reference Agent Gallery

These are small, copyable eve agents that prove the harness is broader than one
analyst demo. Each one is intentionally simple: one persona, one domain skill,
one typed tool, and room to grow.

| Agent | Purpose | Run |
|-------|---------|-----|
| [`support-agent`](./support-agent/) | Triage customer issues and lookup ticket status | `pnpm demo:support` |
| [`research-agent`](./research-agent/) | Review a small source set and produce sourced briefs | `pnpm demo:research` |
| [`ops-agent`](./ops-agent/) | Triage service health and suggest incident next steps | `pnpm demo:ops` |

The flagship full example remains [`../eve-analyst`](../eve-analyst/). These
gallery agents are smaller starting points for different domains.
