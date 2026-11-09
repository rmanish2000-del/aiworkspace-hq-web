import { createFileRoute, redirect } from "@tanstack/react-router";

/** Products index merged into Our Work — keep this path as a redirect. */
export const Route = createFileRoute("/products/")({
  beforeLoad: () => {
    throw redirect({ to: "/our-work", replace: true });
  },
});
