import { useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const readValue = (): T => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return initialValue;
      const parsed = JSON.parse(raw);
      // 저장값이 우선, 초기값은 디폴트 역할
      return { ...(initialValue as any), ...(parsed as any) } as T;
    } catch {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // key or initialValue가 바뀌면 최신값으로 동기화
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, JSON.stringify(initialValue)]);

  // 다른 탭에서 변경되면 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setStoredValue(readValue());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (key) {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const remove = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.error(err);
    }
  };

  return [storedValue, setValue, remove] as const;
};
