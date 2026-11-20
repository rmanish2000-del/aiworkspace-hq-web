import { createFileRoute, redirect } from "@tanstack/react-router";

/** Short path for the live product page. */
export const Route = createFileRoute("/tareekh")({
  beforeLoad: () => {
    throw redirect({ to: "/products/tareekh", replace: true });
  },
});
