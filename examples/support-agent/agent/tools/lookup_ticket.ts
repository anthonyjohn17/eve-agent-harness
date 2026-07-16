import { defineTool } from "eve/tools";
import { z } from "zod";

const tickets = {
  "SUP-1001": {
    customer: "Northwind Analytics",
    status: "waiting_on_engineering",
    priority: "high",
    summary: "Dashboard export fails for workspaces with more than 50 reports.",
    owner: "platform",
  },
  "SUP-1002": {
    customer: "Acme Retail",
    status: "waiting_on_customer",
    priority: "medium",
    summary: "Billing contact cannot find the invoice download link.",
    owner: "support",
  },
};

export default defineTool({
  description: "Look up a support ticket by id.",
  inputSchema: z.object({
    ticketId: z.string().describe("Ticket id such as SUP-1001."),
  }),
  async execute({ ticketId }) {
    return {
      ticketId,
      ticket: tickets[ticketId as keyof typeof tickets] ?? null,
    };
  },
});
