"use client";

import { useCallback, useEffect, useState } from "react";

const IS_SERVER = typeof window === "undefined";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (IS_SERVER) return;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with localStorage on mount
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // Malformed JSON or unavailable storage — keep initial value
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        if (!IS_SERVER) {
          try {
            window.localStorage.setItem(key, JSON.stringify(next));
          } catch {
            // Quota exceeded or storage unavailable — state still updates
          }
        }
        return next;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    if (!IS_SERVER) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Storage unavailable
      }
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
