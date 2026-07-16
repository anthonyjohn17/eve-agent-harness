# eve-analyst

A production-shaped **data analyst agent** built on the **eve** framework,
shipped as the flagship example inside **[Eve Agent Harness](../README.md)**.

You ask questions about a company's data in plain English; the agent writes
read-only SQL, follows the business's own revenue rules, guards expensive
queries behind human approval, runs deeper analysis in an isolated sandbox, and
hands open-ended investigations to a subagent. It runs over HTTP and Slack, and
its behavior is locked in by an evals suite.

Fully self-contained: the dataset is seeded in memory, so it runs offline.
Inspired by production Slack data-analyst agents (including Vercel's internal
`d0` pattern), but this demo does not contain or replace that system.

## What it demonstrates


| eve primitive                       | Where                                                                               |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| An agent is a directory             | the whole `agent/` folder                                                           |
| Model config                        | `agent/agent.ts` (`defineAgent`)                                                    |
| System prompt in markdown           | `agent/instructions.md`                                                             |
| Typed tools                         | `agent/tools/` (`list_tables`, `describe_table`, `run_sql`, `run_analysis`)         |
| Human-in-the-loop approval          | `run_sql` pauses on an unbounded full-table scan                                    |
| Skills loaded on demand             | `agent/skills/revenue-rules.md`                                                     |
| Subagents                           | `agent/subagents/investigator/`                                                     |
| Sandbox (isolated code)             | `run_analysis` runs Python in a sandbox (Docker locally / Vercel Sandbox on Vercel) |
| Channels                            | `agent/channels/eve.ts` (HTTP) + `agent/channels/slack.ts`                          |
| Durable sessions                    | pause-for-approval then resume is a durable workflow                                |
| Evals as a **CI / pre-deploy gate** | `evals/*.eval.ts` — run `eve eval --strict` before shipping                         |


## The dataset

A tiny e-commerce warehouse (`customers`, `products`, `orders`, `order_items`,
`refunds`) seeded deterministically into an in-memory SQLite database via
`node:sqlite` (built into Node 24, zero dependencies). It includes
test/internal accounts and refunds, so the `revenue-rules` skill actually
changes the answer. See `agent/lib/db.ts`.

## Requirements

- **Node 24+** (eve requires it) and **pnpm 10+**
- An `ANTHROPIC_API_KEY` (the agent uses `@ai-sdk/anthropic` with `claude-sonnet-5`)

## Run it locally

```bash
pnpm install
export ANTHROPIC_API_KEY=sk-ant-...      # or put it in .env.local
pnpm dev                                 # starts the eve dev TUI
```

Then talk to it in the TUI, or drive it over HTTP:

```bash
# create a session
curl -X POST http://127.0.0.1:2000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"What was our total revenue, broken down by product category?"}'
# stream the reply (use the sessionId from the response)
curl -N http://127.0.0.1:2000/eve/v1/session/<sessionId>/stream
```

Try these to see each feature:

- "What tables are in the warehouse?" → schema discovery
- "What was our total revenue?" → loads the `revenue-rules` skill, answers net of refunds
- "Run this exact query: `SELECT * FROM order_items`" → pauses for your approval, then resumes
- "Use run_analysis to chart weekly revenue" → runs Python in the sandbox
- "Revenue dropped last week, why?" → delegates to the `investigator` subagent

## Test it

```bash
node --test test/*.test.ts             # unit tests (SQL guard + dataset)
pnpm exec eve eval --strict            # agent evals (run before deploy / in CI)
node test/e2e.mjs                      # end-to-end multi-turn conversation (needs `pnpm dev` running)
node test/prod-checks.mjs              # correctness + edge cases + sandbox network isolation
pnpm typecheck                         # tsc
```

Evals are a **manual / CI gate**, not automatically executed by `eve deploy`.

## Deploy it

```bash
vercel login          # one-time (Vercel is a supported host)
pnpm exec eve deploy  # links a Vercel project and deploys
```

Set `ANTHROPIC_API_KEY` in the project Environment Variables so the deployed
agent can reach the model.

Self-host path: `pnpm build && pnpm start` (see eve deployment docs).

### Auth note (important)

`agent/channels/eve.ts` includes `none()` so the public demo endpoint is easy
to try. That is intentional for demos — **remove** `none()` **and add real auth**
(Auth.js, Clerk, `httpBasic`, etc.) for any real deployment.

## Enable Slack (optional)

The Slack channel (`agent/channels/slack.ts`) uses a **direct Slack app** with
environment credentials (no Vercel Connect required):

```bash
# .env.local and/or host project env
export SLACK_BOT_TOKEN=xoxb-...
export SLACK_SIGNING_SECRET=...
```

In the Slack app: add bot scopes (`app_mentions:read`, `chat:write`,
`im:history`, `im:write`, `users:read`), enable Event Subscriptions with
Request URL `https://<your-deployment>/eve/v1/slack`, subscribe to
`app_mention` (and `message.im` for DMs), then install the app to the workspace.

## Design notes

- **Read-only by construction.** `agent/lib/sql-guard.ts` rejects anything that is not a single
`SELECT`; both the primary agent and the subagent go through it (`agent/lib/run-select.ts`).
- **Approval lives on the human-facing agent, not the subagent.** The primary `run_sql` pauses
on expensive scans; the autonomous `investigator` runs read-only SQL without prompts.
- **No filesystem writes.** The dataset is in-memory and seeded per process, so it behaves the
same on a laptop and on a read-only serverless filesystem.
- **The sandbox has no network.** `agent/sandbox.ts` pins `networkPolicy: "deny-all"` (eve's
default is allow-all), so model-written code runs isolated with no egress. Verified by
`test/prod-checks.mjs`.

---

## License

This demo follows the distribution license: Apache-2.0
(see `[../LICENSE](../LICENSE)` and `[../NOTICE](../NOTICE)`). The `eve`
framework is also Apache-2.0.