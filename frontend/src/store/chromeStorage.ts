// src/utils/chromeStorage.ts
import { PersistStorage, StorageValue } from "zustand/middleware"

export function createChromeStorage<T>(): PersistStorage<T> {
  return {
    getItem: (name: string): Promise<StorageValue<T> | null> => {
      return new Promise((resolve) => {
        chrome.storage.sync.get([name], (result) => {
          const storedValue = result[name]
          if (!storedValue) return resolve(null)

          try {
            const parsed = JSON.parse(storedValue) as StorageValue<T>
            resolve(parsed)
          } catch {
            resolve(null)
          }
        })
      })
    },

    setItem: (name: string, value: StorageValue<T>): Promise<void> => {
      return new Promise((resolve) => {
        const stringified = JSON.stringify(value)
        chrome.storage.sync.set({ [name]: stringified }, () => resolve())
      })
    },

    removeItem: (name: string): Promise<void> => {
      return new Promise((resolve) => {
        chrome.storage.sync.remove(name, () => resolve())
      })
    },
  }
}
