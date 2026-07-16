<div align="center">
  <a href="../README.md">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".github/assets/eve.svg">
      <img alt="eve logo" src=".github/assets/eve.svg" height="128">
    </picture>
  </a>
  <h1>eve</h1>

<a href="https://www.npmjs.com/package/eve"><img alt="NPM version" src="https://img.shields.io/npm/v/eve.svg?style=for-the-badge&labelColor=000000"></a>
<a href="../LICENSE"><img alt="License" src="https://img.shields.io/npm/l/eve.svg?style=for-the-badge&labelColor=000000"></a>

</div>

**eve** is a filesystem-first framework for durable AI agents. Core agent
capabilities live in conventional locations, so projects are easier to inspect,
extend, and operate.

This tree is the framework source inside **[Eve Agent Harness](../README.md)**.
The technical package name remains `eve` for compatibility.

## The filesystem is the interface

A typical eve agent has this structure:

```text
my-agent/
└── agent/
    ├── agent.ts            # Optional: model and runtime config
    ├── instructions.md     # Required: the always-on system prompt
    ├── tools/              # Optional: typed functions the model can call
    │   └── get_weather.ts
    ├── skills/             # Optional: procedures loaded on demand
    │   └── plan_a_trip.md
    ├── channels/           # Optional: message channels (HTTP, Slack, Discord)
    │   └── slack.ts
    └── schedules/          # Optional: recurring cron jobs
        └── weekly_recap.ts
```

eve discovers these files and compiles them into a runtime manifest. You do
not manually import every tool or skill into `agent.ts`.

Read [`docs/`](./docs) for the full project layout and guides. Distribution-level
specs live in [`../docs/`](../docs/).

## Quick start

From the published package:

```bash
npx eve@latest init my-agent
```

Or start from the harness reference agent:

```bash
cd ../eve-analyst
pnpm install
export ANTHROPIC_API_KEY=sk-ant-...
pnpm dev
```

> [!NOTE]
> The `eve` package includes its full documentation, so coding agents can read
> it locally from `node_modules/eve/docs`.

### A minimal example

Replace `agent/instructions.md` with:

```md
You are a concise weather demo assistant. Tell users that the weather data is mocked.
```

Add a mock weather tool at `agent/tools/get_weather.ts`:

```ts
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Return mock weather data for a city.",
  inputSchema: z.object({ city: z.string().min(1) }),
  async execute({ city }) {
    return { city, condition: "Sunny", temperatureF: 72 };
  },
});
```

Choose the model in `agent/agent.ts`:

```ts
import { defineAgent } from "eve";

export default defineAgent({
  model: "anthropic/claude-sonnet-5",
});
```

```bash
npm run dev
```

That's a working agent. Add human-in-the-loop prompts, subagents, and schedules
as needed. Follow the [first-agent tutorial](./docs/tutorial/first-agent.mdx)
for a complete walkthrough (analytics assistant).

## Develop this monorepo

```bash
pnpm install
pnpm build
pnpm dev            # watch eve + weather-agent fixture
pnpm test:unit
pnpm typecheck
pnpm lint
```

See [`../AGENTS.md`](../AGENTS.md) and [`AGENTS.md`](./AGENTS.md) for coding-agent
guidance.

## Preview status

eve is currently in preview/beta: APIs, documentation, and behavior may change
before general availability. As the deployer, you are responsible for approval
policies, auth, sandbox network controls, and other safeguards. See
[`docs/responsible-use.md`](./docs/responsible-use.md).

## Security

Please do not open public issues for security vulnerabilities. See
[SECURITY.md](SECURITY.md).

## License

Apache-2.0. See [`../LICENSE`](../LICENSE), [`LICENSE`](./LICENSE), and
[`NOTICE`](./NOTICE). Technical references:
[eve.dev/docs](https://eve.dev/docs) · [npm `eve`](https://www.npmjs.com/package/eve).
