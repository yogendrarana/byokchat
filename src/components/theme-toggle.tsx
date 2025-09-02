import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Select Theme"
      onClick={() => {
        toggleTheme();
      }}
    >
      {theme === 'light' ? <SunIcon size={2} /> : <MoonIcon size={2} />}
    </Button>
  );
}
