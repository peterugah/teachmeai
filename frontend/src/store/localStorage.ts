import { PersistStorage, StorageValue } from "zustand/middleware";

export function createLocalStorage<T>(): PersistStorage<T> {
  return {
    getItem: (name: string): Promise<StorageValue<T> | null> => {
      return new Promise((resolve) => {
        const storedValue = localStorage.getItem(name);
        if (!storedValue) return resolve(null);

        try {
          const parsed = JSON.parse(storedValue) as StorageValue<T>;
          resolve(parsed);
        } catch {
          resolve(null);
        }
      });
    },

    setItem: (name: string, value: StorageValue<T>): Promise<void> => {
      return new Promise((resolve) => {
        const stringified = JSON.stringify(value);
        localStorage.setItem(name, stringified);
        resolve();
      });
    },

    removeItem: (name: string): Promise<void> => {
      return new Promise((resolve) => {
        localStorage.removeItem(name);
        resolve();
      });
    },
  };
}
