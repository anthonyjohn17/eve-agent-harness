# Vercel’s Eve AI Agent Framework 🧠⚙️

> **Note:** This file is background research / video notes kept for context.
> It is not the product specification. Prefer [`README.md`](./README.md),
> [`docs/FRAMEWORK_SPEC.md`](./docs/FRAMEWORK_SPEC.md), and
> [`docs/AGENT_CONVENTION.md`](./docs/AGENT_CONVENTION.md).

**Eve**, a newly released **open-source AI agent framework by Vercel**. Eve is a important step forward in how production-grade AI agents are structured, built, deployed, and scaled.

At the center of the framework is a strikingly simple idea:

> **An AI agent can be represented as a folder.**

This “file system first” approach is the core concept behind Eve.

---

## Eve’s Core Idea: File-System-Based Agents

Eve is interesting because it treats an AI agent as a **file-system-first project**.

Traditionally, file-system-based agents are associated with:

- personal AI agents,
- second-brain systems,
- local knowledge assistants,
- markdown-based personal workflows,
- experimental setups that are easy to modify but not necessarily production-grade.

This kind of architecture usually feels more suited to a personal agent than to something deployed for thousands or millions of real users.

Eve changes that by making the same easy folder-based structure viable for **production deployments**.

The major claim is:

> Eve combines the flexibility of file-system-based agents with the reliability and scalability needed for real production environments.

This is what makes Eve notable. It takes something that has historically been lightweight, personal, and informal, and gives it a deployment-ready foundation.

---



## “Your AI Agent Is Just a Folder”

This simple mental model is central:

> **Your AI agent is a folder containing organized files and subfolders.**

Inside the main agent folder, different capabilities are broken into separate directories and files. The agent is composed out of modular primitives.

The major things that can live inside the folder structure include:


| Component         | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `instructions.md` | The system prompt or global instructions                |
| `agent.ts`        | The main agent definition, including model selection    |
| `skills/`         | Reusable capabilities or behavioral rules               |
| `tools/`          | Functions the agent can call                            |
| `sandbox/`        | Secure code execution environment                       |
| `channels/`       | Interfaces like Slack, Discord, local CLI, or custom UI |
| `connections/`    | External services, including MCP servers                |
| `subagents/`      | Worker agents or specialized agents                     |
| `schedules/`      | Scheduled autonomous tasks                              |
| `evals/`          | Tests/evaluations that can gate deployment              |


The main folder acts as the wrapper that brings all these pieces together.

The value of this structure is **composability**. Each primitive gets its own place. The developer can add, remove, or change capabilities by modifying files and folders rather than wiring everything manually inside one large codebase.

---



## Eve's Value Prop

Eve caught attention because many organizations are already building similar structures internally.

In many companies, teams are designing their own custom folder conventions for agents:

- one folder for the agent,
- one place for model configuration,
- one place for skills,
- one place for prompts,
- one place for tools,
- one place for integrations.

But these internal systems are usually idiosyncratic. Each organization has its own way of structuring things.

Eve’s importance is that it may provide a **standardized version** of this architecture.

Eve potentially gives the AI agent ecosystem a common, simple convention for defining agents through the file system.

This matters because standards allow people to:

- learn from each other,
- reuse patterns,
- build compatible tools,
- share agent structures,
- make open-source collaboration easier.

Eve is explicitly framed as part of the broader industry movement toward standards, mentioning examples like **MCP**, **A2A**, and **OKF**.

---

## Eve’s Compilation Step Is the Most Impressive Part

A central technical point is Eve’s **compilation step**.

When you build an agent as a folder, there is actually a lot of hidden plumbing required:

- finding the skills,
- finding the tools,
- loading subagents,
- connecting MCP servers,
- wiring channels,
- respecting hooks,
- combining instructions,
- generating the final runtime representation.

In many frameworks, developers would have to manually import or connect these pieces.

Eve avoids that.

When you run or deploy the agent, Eve:

1. traverses the agent folder,
2. discovers the defined primitives,
3. finds the skills, tools, channels, MCP servers, subagents, schedules, etc.,
4. compiles them into a single manifest,
5. hooks everything together automatically.

The result is a **compiled agent** with all connections resolved.

This is especially impressive because the main `agent.ts` file does **not** need to manually import or reference every skill, tool, or subagent.

You can add a skill by dropping it into the skills folder.
You can add a tool by placing it in the tools folder.
You can add a subagent by putting it in the subagents folder.

Eve handles the wiring.

This compares to how skills work in coding agents like **Claude Code**. In Claude Code, you can place a `skill.md` file inside a skills folder, and the system automatically understands it as an available capability. Eve follows a similar principle, but extends it toward production-grade agent deployment.

---



## Eve Compared to Coding-Agent Skills

A comparison to Claude Code’s skill system is useful.

In Claude Code:

- a `skill.md` file placed in the right folder becomes available to the coding agent,
- the skill can be invoked through slash commands,
- the user does not need to manually wire the skill into the agent.

Eve uses a similar pattern, but for a broader and more production-ready agent framework.

The difference is that Eve is not only about coding-agent workflows. It is intended to structure agents that can be:

- deployed,
- connected to external channels,
- scaled,
- sandboxed,
- evaluated,
- integrated with human approval,
- used by many users simultaneously.

So Eve borrows the simplicity of coding-agent skill folders but adds the infrastructure needed for real deployed agents.

---



## Production Reliability Through Vercel Infrastructure

A major focus is why Eve can scale to production.

Eve is not just a folder convention. It also benefits from Vercel’s infrastructure.

Several production-grade features are highlighted.

---



### Durable Sessions

Eve provides **durable sessions**.

Every session is a **checkpointed workflow** that survives crashes and redeploys.

This means that every turn, tool call, and intermediate state can be stored. If something breaks or the deployment changes, the agent can resume naturally instead of losing state.

This matters because production AI agents need reliability. They cannot simply crash halfway through a multi-step workflow and forget what happened.

---



### Isolated Sandboxing

Eve supports isolated sandboxing for code execution.

This allows an agent to:

- write code,
- run code,
- process data,
- execute computations,

while doing so in a more secure and isolated environment.

This is essential because agents that can execute code need guardrails. Without sandboxing, production agents become dangerous or unreliable.

---



### Human-in-the-Loop Approval

Eve includes human-in-the-loop functionality.

The agent can pause at risky steps and require user approval before continuing.

Examples of risky actions include database queries that could be expensive, broad, or potentially unsafe.

The principle is:

> Give the agent real power, but require human approval for risky actions.

This is a balanced approach. If you simply prevent the agent from doing powerful things, it becomes less useful. But if you allow it to do everything freely, it can run wild. Human approval creates a middle path.

---



### Evals as a Deployment Gate

Eve supports evals as part of the agent folder structure.

Evals can live in their own folder, just like skills and tools.

Before deploying an updated agent, you can run evals to confirm expected behavior. These evals can produce green check marks across the board before the deployment proceeds.

This turns evaluation into a deployment gate.

In other words:

> The agent should pass its behavioral tests before being pushed to production.

This is another important reliability feature.

---



### Hosting and Scaling

Because Eve is from Vercel, Vercel can handle hosting and scaling.

This means developers do not need to:

- host the agent on their own machine,
- manually provision infrastructure,
- build separate scaling systems,
- connect to some unrelated deployment platform.

Vercel can handle the deployed agent and scale it to thousands or millions of users.

Vercel is incentivized to make deployment to Vercel attractive, but that is fair because the framework is made by Vercel and designed around that ecosystem.

---



## Channels and External Integrations

Eve supports easy connections to different platforms.

This specifically includes:

- local CLI interaction,
- Slack,
- Discord,
- custom UI through an API,
- MCP servers,
- external services and tools.

A Slack integration demonstrates that an Eve agent can be addressed inside Slack, reply in threads, maintain short-term thread memory, and request approvals through Slack buttons.

This is important because production agents often need to live where users already work.

For internal company workflows, Slack is a natural channel. Eve makes it possible for the agent to operate inside Slack while being backed by a proper production deployment.

---



## Eve as a Standard for Agent Structure

Eve is especially exciting because of the importance of standards.

Standards are what move industries forward.

Several standards or emerging standards are relevant:

- **MCP**
- **A2A**
- **OKF**

Eve will not necessarily become the dominant standard for file-system-based agents. Instead, Eve is setting a precedent.

The claim is more nuanced:

> Even if Eve itself is not the final standard, the eventual standard for file-system-based agents will probably look something like this.

Eve serves as a strong early reference design for how agents should be organized on disk.

---



## Eve and OKF: Agent Structure vs. Knowledge Structure

There is a distinction between two kinds of file-system organization:

1. the structure of the **agent itself**,
2. the structure of the **knowledge base** attached to the agent.

One suggestion is:

- Eve could become a standard for structuring the core agent.
- OKF could become a standard for structuring the knowledge bases connected to agents.

This distinction is important to avoid overclaiming.

When talking about Eve scaling file-system-based agents to production, that does **not** mean scaling massive markdown knowledge bases.

It is specifically not about “LLM wikis” or enormous markdown document collections with tens of thousands of files.

Those do not necessarily scale well.

Instead, Eve is about scaling the **core primitives of the agent**:

- skills,
- tools,
- MCP servers,
- channels,
- schedules,
- subagents,
- evals,
- instructions.

The knowledge base remains a separate concern.

This is a key nuance.

---



## Building Eve Agents with the Vercel Plugin

Here is how developers can build Eve agents.

Vercel ships a plugin that can be installed into coding agents like:

- Claude Code,
- Cursor.

The plugin includes:

- Vercel skills,
- a Vercel Eve skill,
- the Vercel MCP server for deployment.

This plugin can be used to build the demo agent shown later.

The value of the plugin is that the coding agent understands Eve’s structure. It knows how to:

- scaffold the agent,
- create channels,
- add skills,
- build schedules,
- set up sandboxing,
- configure deployment,
- guide the developer through credentials.

This means you do not need to be an Eve expert to build production-ready agents.

You can ask a coding agent to create or modify the Eve project, and the plugin gives the coding agent the framework-specific knowledge it needs.

---



## The Eve Analyst Agent Demo

A concrete demo is the **Eve analyst agent**.

The demo is a full agent that uses multiple Eve capabilities.

The agent is an analytics-style assistant connected to a database/warehouse. It can answer questions about revenue, sales, growth, and warehouse tables.

The demo repository is linked in the video description.

Cloning the Eve analyst agent locally allows a walkthrough of its structure.

---



## The Basic Agent Structure

Inside the agent folder, the demo is mostly a collection of:

- Markdown files,
- TypeScript files.

The key starting file is `agent.ts`.

`agent.ts` is very simple.

The main requirement is to specify the model. In the demo, the agent is connected to **Claude Sonnet 5** through the Anthropic API.

The Anthropic API key is set through environment variables.

Once `agent.ts` exists, the agent can already run. Other components are optional, though obviously useful agents will usually need skills, tools, channels, etc.

---



## Running the Agent Locally

Opening a terminal in VS Code and running the Eve command starts the agent locally.

Typing “hi” into the local agent interface produces a streamed response from the model.

This demonstrates the minimum viable Eve agent:

- create `agent.ts`,
- specify a model,
- set the environment variable,
- run the Eve command,
- start chatting.

It is extremely easy to get started.

---



## Skills in the Demo Agent

The demo agent includes a skill: a **revenue rule skill**.

The skill includes a description telling the agent when to load it:

> Load this before answering revenue, sales, or growth questions.

The skill also contains simple rules to improve the agent’s output.

The demo is intentionally simple, but the point is that the skill helps make answers:

- more consistent,
- more repeatable,
- better formatted,
- behaviorally constrained.

The agent loads the skill automatically when the relevant kind of question is asked.

---



## Channels in the Demo Agent

The demo agent includes channels.

These include:

- local Eve interaction,
- Slack.

The local channel is what is used when running the agent in the terminal.

The Slack channel allows the deployed agent to respond inside Slack.

A coding agent can help configure credentials for these channels.

---



## Subagent: The Investigator

The demo includes a subagent called an **investigator**.

Its purpose is to handle deeper analytical questions, such as:

> Why did this metric change?

Some tasks may require more tokens or deeper investigation. In those cases, the main agent can dispatch work to a specialized worker/subagent.

This reflects a common production-agent pattern:

- main agent handles the conversation,
- subagents handle specialized or expensive reasoning tasks.

---



## Instructions File

The demo includes an `instructions.md` file.

This contains the core system prompt.

An example of the agent identity:

> You are Eve analyst, careful data analyst, etc.

This file defines the overall behavior, role, and tone of the agent.

Again, this is part of Eve’s modular file structure.

---



## Tools as TypeScript Files

The tools folder is shown.

Tools are simple TypeScript files.

One example tool lists the contents or row counts of database tables.

Each tool is basically a single operation against the database.

The tools use **Zod** for typing. This helps make the inputs reliable, so the agent passes arguments in the expected shape.

The important point is that tools do not need to be manually imported into the central agent file.

You define a function in the tools folder, and Eve discovers it during compilation.

This is much simpler than other agent frameworks, where tools often have to be manually wired into the agent runtime.

---



## Asking the Agent About Warehouse Tables

A demo question for the agent:

> What tables are in the warehouse, and how many rows does each have?

This question does not require a skill or subagent. It simply uses the database tools.

The agent makes a tool call, lists the tables, and returns the requested information quickly.

This shows that basic tool usage works cleanly and automatically.

---



## Asking a Revenue-Based Question

A revenue-related question is also useful to try.

Because the question concerns revenue, sales, or growth, the agent loads the revenue skill.

The sequence is:

1. Agent recognizes the question needs the revenue skill.
2. It loads the skill instructions.
3. It makes tool calls to retrieve data.
4. It runs SQL.
5. It processes the information.
6. It returns the final answer in the format specified by the skill.

The response takes a little longer because it requires more processing, but the final answer follows the skill-defined output format exactly.

This demonstrates how skills can shape agent behavior without manual wiring.

---



## Deployment Through the Vercel Plugin

Once satisfied with the agent, it can be deployed.

The process is as simple as telling the coding agent:

> Deploy this Eve agent.

The Vercel plugin and MCP server handle the deployment process.

The coding agent uses the Vercel MCP connection to deploy the Eve agent.

The deployment completes successfully and includes a smoke test to confirm that the agent is working.

The eval suite could be run at this point by simply telling the coding agent to run the evals.

This reinforces the idea that the plugin turns Eve development into a highly agent-assisted workflow.

---



## Scaffolding a New Agent from Scratch

While the deployment is running, a new Claude Code instance can show how easy it is to create a new agent.

A prompt like:

> Scaffold a new Eve agent called hello agent.

That is basically all it takes.

The coding agent understands that it should use the Eve skill and create the correct folder structure.

The developer can also describe desired skills, subagents, or other capabilities, and the coding agent can generate those too.

It is not an exaggeration to say it could not be easier.

---



## Slack Integration Demo

After deployment, the Eve analyst agent can be demonstrated inside Slack.

Setting up the Slack app requires several manual steps. Claude Code can help walk through it, but there is still some setup involved.

Once configured, the agent can be mentioned in Slack using something like:

> `@eveanalyst hi`

Slack then shows that the analyst is thinking.

The agent replies in a thread.

Clicking into the thread continues the conversation.

Asking:

> What did I just say?

The agent correctly uses short-term memory within the Slack thread.

This demonstrates:

- Slack channel integration,
- threaded conversation support,
- short-term conversation history,
- parallel conversations,
- Vercel-backed scaling.

Because the agent is deployed and scaled through Vercel, many users could interact with it at the same time.

---



## Human-in-the-Loop Approval in Slack

Human approval can also be demonstrated inside Slack.

An intentionally somewhat artificial prompt asks the agent to run a SQL query.

This is not how someone would normally talk to the agent, but it is done to trigger the approval mechanism.

The query is considered risky because it could involve a large database select operation.

The agent pauses and surfaces an approval request in Slack.

Slack displays buttons such as:

- approve/allow,
- deny.

Clicking allow lets the agent then run the query and return the answer.

This demonstrates that human-in-the-loop approval is integrated directly into Slack.

This is one of the most important reliability features for production agents, especially internal company agents used in platforms like Slack.

The principle is:

> More agent power is acceptable if risky actions require explicit approval.

---



## Why Human Approval Matters

The design tradeoff is worth reflecting on.

One option is to prevent the agent from doing risky actions at all. That is safer, but it makes the agent less useful.

Another option is to let the agent do everything freely. That is powerful, but dangerous.

Eve supports a better middle ground:

- let the agent have meaningful capabilities,
- but require approval for actions that could be risky.

This creates practical reliability for production deployments.

This is a major reason Eve is suitable for real organizations.

---



## Simplicity Without Losing Production Power

Toward the end, the reason Eve is exciting can be summed up as follows.

The industry is moving toward a point where a serious AI agent can be:

> a single organized folder containing Markdown and TypeScript.

That would have seemed surprising even six months ago.

It would have sounded crazy if someone had said agents were headed in this direction.

But now, Eve shows that you can get:

- file-system simplicity,
- modularity,
- composability,
- local development,
- coding-agent-assisted scaffolding,
- deployment,
- durability,
- sandboxing,
- evals,
- Slack integration,
- human approvals,
- Vercel scalability,

without losing the power of production-grade agents.

This is the core excitement.

---



## Main Takeaways

Eve is an important new agent framework because it standardizes a file-system-first way to build agents while keeping production concerns in mind.

The biggest takeaways are:

1. **Eve treats an AI agent as a folder.**
  The agent’s core primitives live as organized files and subfolders.
2. **Everything is composable.**
  Skills, tools, subagents, schedules, channels, instructions, evals, and connections are defined separately.
3. **The compilation step is key.**
  Eve automatically discovers and wires together the agent’s components into a manifest.
4. **The main agent file stays simple.**
  You do not manually import every skill, tool, or subagent into `agent.ts`.
5. **Eve is production-oriented.**
  It supports durable sessions, sandboxed code execution, human approvals, eval-gated deployment, and scalable hosting.
6. **Vercel’s plugin makes building agents easier.**
  Coding agents like Claude Code or Cursor can scaffold and deploy Eve agents with framework-aware skills.
7. **Slack integration is practical and powerful.**
  Agents can operate inside Slack threads, remember context, and ask for human approval.
8. **Eve may become or influence a standard.**
  Even if Eve is not the final standard, future file-system-agent standards will look similar.
9. **Eve is not about scaling giant markdown knowledge bases.**
  It is about scaling the core agent architecture and primitives.
10. **Eve is a major simplification of production agent development.**
  It preserves power while making the structure much easier to understand and build.

---



## Strategic Interpretation

The deeper message is that AI agent development is becoming more standardized, modular, and file-native.

Instead of agents being opaque bundles of custom framework code, Eve suggests a future where agents are structured like clear repositories:

```text
agent/
  agent.ts
  instructions.md
  skills/
  tools/
  channels/
  subagents/
  schedules/
  evals/
  connections/
  sandbox/
```

This matters because it gives teams a shared way to reason about agents.

It also makes agent development much more compatible with AI coding tools. If the agent is a folder of Markdown and TypeScript, then coding agents can understand, edit, scaffold, test, and deploy it more naturally.

That is the underlying shift:

> AI agents are becoming not just things we build with code, but structured artifacts that coding agents themselves can understand and evolve.

