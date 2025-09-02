import { CreditCard, User2, Settings2 } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';

import { cn } from '@/lib/utils';

const routes = [
  {
    label: 'Account',
    icon: User2,
    href: '/settings',
  },
  {
    label: 'Preferences',
    icon: Settings2,
    href: '/settings/preferences',
  },
  {
    label: 'Billing',
    icon: CreditCard,
    href: '/settings/billing',
  },
];

interface PropTypes {
  className?: string;
}

export function SettingsNav({ className }: PropTypes) {
  const location = useLocation();

  return (
    <div className={cn(className)}>
      <div className="hidden md:flex gap-8">
        {routes.map(route => {
          const Icon = route.icon;
          const isActive = location.pathname === route.href;

          return (
            <Link key={route.href} to={route.href}>
              <div
                className={cn(
                  'flex items-center py-4 text-sm font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {route.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
