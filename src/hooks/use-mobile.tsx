import * as React from 'react';
import { useHydrated } from './use-hydrated';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const isHydrated = useHydrated();

  React.useEffect(() => {
    // Set initial value after hydration
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Return false during SSR to prevent hydration mismatch
  return isHydrated ? isMobile : false;
}
