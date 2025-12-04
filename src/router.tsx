import { createRouter as createTanstackRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen.ts";
import NotFound from "@/components/not-found.tsx";
import { queryClient } from "@/config/tanstack-query.ts";

export function createRouter() {
  return createTanstackRouter({
    routeTree,
    context: {
      queryClient,
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => <NotFound />,
    defaultPreload: "intent",
    defaultStaleTime: 0,
  });
}

// Export getRouter for TanStack Start's generated routeTree
export function getRouter() {
  return createRouter();
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
