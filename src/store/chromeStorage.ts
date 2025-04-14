import { StateStorage } from "zustand/middleware";

export const chromeStorage: StateStorage = {
  getItem: async (name) => {
    const result = await chrome.storage.local.get(name);
    return result[name] ?? null;
  },
  setItem: async (name, value) => {
    await chrome.storage.local.set({ [name]: value });
  },
  removeItem: async (name) => {
    await chrome.storage.local.remove(name);
  },
};