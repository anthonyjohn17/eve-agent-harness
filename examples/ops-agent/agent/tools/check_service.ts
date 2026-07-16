import { defineTool } from "eve/tools";
import { z } from "zod";

const services = {
  api: {
    status: "degraded",
    errorRate: "4.8%",
    p95LatencyMs: 1420,
    recentDeploy: "2026-07-16T18:44:00Z",
    note: "Errors concentrated on POST /v1/session.",
  },
  workers: {
    status: "healthy",
    errorRate: "0.2%",
    p95LatencyMs: 310,
    recentDeploy: "2026-07-15T21:10:00Z",
    note: "Queue depth normal.",
  },
};

export default defineTool({
  description: "Return current synthetic health signals for a service.",
  inputSchema: z.object({
    service: z.enum(["api", "workers"]).describe("Service to inspect."),
  }),
  async execute({ service }) {
    return {
      service,
      health: services[service],
    };
  },
});
