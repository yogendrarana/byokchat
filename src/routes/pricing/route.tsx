import { Outlet, createFileRoute } from '@tanstack/react-router';

import SiteFooter from '@/components/layout/footer';
import SiteHeader from '@/components/layout/header';
import MaxWidthContainer from '@/components/max-width-container';

export const Route = createFileRoute('/pricing')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <MaxWidthContainer>
        <div className="border-l border-r">
          <SiteHeader />
          <div className='px-4'>
            <Outlet />
          </div>
          <SiteFooter className='border-t' />
        </div>
      </MaxWidthContainer>
    </div>
  );
}
