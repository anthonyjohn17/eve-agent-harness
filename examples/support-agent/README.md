# support-agent

A small support triage agent.

It demonstrates:

- `instructions.md` for support tone and workflow
- `skills/support-playbook.md` for policy constraints
- `tools/lookup_ticket.ts` for typed ticket lookup

Run from the repo root:

```bash
ANTHROPIC_API_KEY=sk-ant-... pnpm demo:support
```

Try:

- `Please triage SUP-1001.`
- `A customer says exports fail on large workspaces. What should support do next?`
