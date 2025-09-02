import { Toaster } from 'sonner';
import type { QueryClient } from '@tanstack/react-query';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Outlet, HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router';

// CSS files
import globalsCss from '../styles/globals.css?url';

import { siteData } from '@/config/site';
import { Providers } from '@/components/providers';
import { ErrorBoundary } from '@/components/error-boundary';
import { ThemeScript } from '@/components/theme-script';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: `${siteData.name} - ${siteData.description}`,
      },
    ],
    links: [{ rel: 'stylesheet', href: globalsCss }],
  }),

  component: () => (
    <ErrorBoundary>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ErrorBoundary>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ThemeScript />
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Toaster />
        
        <Scripts />
        <TanStackRouterDevtools />
      </body>
    </html>
  );
}
