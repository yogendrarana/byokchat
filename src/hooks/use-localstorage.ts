import * as React from "react";
import { useHydrated } from "./use-hydrated";

/**
 * Hook to safely access localStorage with hydration safety
 * @param key localStorage key
 * @param defaultValue default value if key doesn't exist
 * @returns [value, setStoredValue, deleteStoredValue] tuple
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const isHydrated = useHydrated();

  // Memoize defaultValue to avoid unnecessary re-runs if it's an object or array
  const defaultRef = React.useRef(defaultValue);

  React.useEffect(() => {
    defaultRef.current = defaultValue;
  }, [defaultValue]);

  const [value, setValue] = React.useState<T>(() => {
    if (typeof window !== "undefined" && localStorage.getItem(key) !== null) {
      try {
        return JSON.parse(localStorage.getItem(key)!);
      } catch {
        return defaultRef.current;
      }
    }
    return defaultRef.current;
  });

  React.useEffect(() => {
    if (isHydrated) {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        try {
          setValue(JSON.parse(stored));
        } catch {
          setValue(defaultRef.current);
        }
      }
    }
  }, [key, isHydrated]);

  React.useEffect(() => {
    if (!isHydrated) return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) {
        setValue(e.newValue ? JSON.parse(e.newValue) : defaultRef.current);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [isHydrated, key]);

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const valueToStore =
        typeof newValue === "function" ? (newValue as (prev: T) => T)(prev) : newValue;

      if (isHydrated) {
        try {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (err) {
          console.error("Failed to write to localStorage:", err);
        }
      }
      return valueToStore;
    });
  };

  const deleteStoredValue = () => {
    if (isHydrated) {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.error("Failed to remove localStorage key:", err);
      }
    }
  };

  return [value, setStoredValue, deleteStoredValue] as const;
}
