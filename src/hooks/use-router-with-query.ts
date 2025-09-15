import { useEffect, useState } from "react";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

import { router as baseRouter } from "../router";
import { queryClient } from "@/config/tanstack-query";

export function useRouterWithQuery() {
  const [router, setRouter] = useState(baseRouter);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const queryRouter = routerWithQueryClient(baseRouter, queryClient);
        setRouter(queryRouter);
      } catch (error) {
        console.warn("Failed to create router with query client:", error);
      }
    }
  }, []);

  return router;
}
