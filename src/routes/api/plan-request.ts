/**
 * POST /api/plan-request — scoped plan form from /contact#plan.
 */
import { createFileRoute } from "@tanstack/react-router";

import { handlePlanRequest } from "@/lib/plan-request.server";

export const Route = createFileRoute("/api/plan-request")({
  server: {
    handlers: {
      POST: async ({ request }) => handlePlanRequest(request),
    },
  },
});
