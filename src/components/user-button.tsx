import { Link, useRouter } from '@tanstack/react-router';
import { ArrowRight, BookText, Github, Loader, LogOutIcon, SettingsIcon, Twitter, UserIcon, Users } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import { queryClient } from '@/config/tanstack-query';

export function UserButton() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-md">
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!data?.user) {
    return (
      <Button variant="outline" className={cn('transition-all duration-300')}>
        <Link to="/auth/login" className="flex items-center">
          Login
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    );
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    await queryClient.resetQueries({ queryKey: ['session'] });
    await queryClient.resetQueries({ queryKey: ['token'] });
    router.navigate({ to: '/' });

    // Only access localStorage after hydration
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.includes('_CACHE')) {
          localStorage.removeItem(key);
        }
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={data.user.image || undefined} alt={data.user.name || 'User'} />
            <AvatarFallback>{data.user.name ? getInitials(data.user.name) : <UserIcon className="h-4 w-4 rounded-md" />}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">{data.user.name || 'User'}</p>
            <p className="text-muted-foreground text-xs leading-none">{data.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <SettingsIcon className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <BookText className="h-4 w-4" />
            <span>Docs</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.navigate({ to: '/' })}>
          <Users className="h-4 w-4" />
          <span>About Us</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-4 w-4" />
            <span>Twitter</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
