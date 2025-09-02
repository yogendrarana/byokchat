import { THEME_MODE } from '@/constants/localstorage';

function getThemeInitScript() {
  return `
    (function() {
      try {
        var THEME_MODE_KEY = '${THEME_MODE}';
        const root = document.documentElement;

        let userPreference = 'system';
        try {
          const persistedThemeMode = localStorage.getItem(THEME_MODE_KEY);
          if (persistedThemeMode) {
            userPreference = JSON.parse(persistedThemeMode);
          }
        } catch (err) {
          console.warn("Theme initialization failed:", err.message);
        }

        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Resolve the actual theme to apply
        const resolvedTheme = userPreference === 'system' 
          ? (prefersDark ? 'dark' : 'light')
          : userPreference;

        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);
      } catch (e) {
        console.error('Theme initialization error:', e);
      }
    })();
  `;
}

export const ThemeScript = () => <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} suppressHydrationWarning />;
