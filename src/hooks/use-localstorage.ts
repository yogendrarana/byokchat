import * as React from 'react';
import { useHydrated } from './use-hydrated';

/**
 * Hook to safely access localStorage with hydration safety
 * @param key localStorage key
 * @param defaultValue default value if key doesn't exist
 * @returns [value, setValue] tuple
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const isHydrated = useHydrated();
  const [value, setValue] = React.useState<T>(defaultValue);

  React.useEffect(() => {
    if (isHydrated) {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        try {
          setValue(JSON.parse(stored));
        } catch {
          setValue(defaultValue);
        }
      }
    }
  }, [key, defaultValue, isHydrated]);

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    const valueToStore = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;
    setValue(valueToStore);

    if (isHydrated) {
      localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };

  return [value, setStoredValue] as const;
}
