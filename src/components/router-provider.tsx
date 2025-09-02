import { useEffect, useState } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { router as baseRouter } from '../router';
import { queryClient } from '@/config/tanstack-query';

export function SafeRouterProvider() {
  const [router, setRouter] = useState(baseRouter);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for hydration to complete
    const timer = setTimeout(() => {
      setIsHydrated(true);
      
      // Then try to create the query client router
      try {
        const queryRouter = routerWithQueryClient(baseRouter, queryClient);
        setRouter(queryRouter);
      } catch (error) {
        console.warn('Failed to create router with query client after hydration:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return <RouterProvider router={router} />;
} 