import { createRouter as createTanstackRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen.ts";
import NotFound from "@/components/not-found.tsx";
import { queryClient } from "@/config/tanstack-query.ts";

// Create the router instance with better error handling
export const router = createTanstackRouter({
  routeTree,
  context: {
    queryClient
  },
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: () => <NotFound />,
  defaultPreload: "intent"
});

export const createRouter = () => {
  return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
