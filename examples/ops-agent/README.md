# ops-agent

A small ops/SRE triage agent.

It demonstrates:

- `instructions.md` for incident response shape
- `skills/incident-triage.md` for operational rules
- `tools/check_service.ts` for typed service-health lookup

Run from the repo root:

```bash
ANTHROPIC_API_KEY=sk-ant-... pnpm demo:ops
```

Try:

- `Check the api service and recommend next steps.`
- `Is workers healthy? Give me the short incident summary.`
