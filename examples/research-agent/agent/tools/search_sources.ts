import { defineTool } from "eve/tools";
import { z } from "zod";

const sources = [
  {
    id: "memo-001",
    title: "Agent folders reduce onboarding cost",
    summary:
      "Teams understand agent behavior faster when prompts, tools, skills, and evals live in predictable paths.",
  },
  {
    id: "memo-002",
    title: "Eval gates catch regressions before launch",
    summary:
      "Behavioral evals work best as a CI habit before deploy, not as an afterthought.",
  },
  {
    id: "memo-003",
    title: "Human approval keeps powerful tools usable",
    summary:
      "Approvals let agents attempt valuable work while pausing on risky actions.",
  },
];

export default defineTool({
  description: "Search the bundled research source notes.",
  inputSchema: z.object({
    query: z.string().describe("Research query or keyword."),
  }),
  async execute({ query }) {
    const normalized = query.toLowerCase();
    return {
      query,
      results: sources.filter(
        (source) =>
          source.title.toLowerCase().includes(normalized) ||
          source.summary.toLowerCase().includes(normalized),
      ),
    };
  },
});
