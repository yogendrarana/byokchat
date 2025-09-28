import { QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from '@/context/theme-context';
import { queryClient } from '@/config/tanstack-query';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
