import { create } from "zustand"
import { Language } from "../enums/language"
import { Theme, } from "../enums/theme";
import { persist } from "zustand/middleware";
import { createChromeStorage } from "./chromeStorage";
import { isLocalhost } from "../utils/isLocalHost";


export interface SettingsStore {
  theme: Theme;
  language: Language;
}

const initialState: SettingsStore = {
  theme: Theme.Light,
  language: Language.English,
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    () => initialState,
    {
      name: "settings-store", //TODO: prefix it to have the user's unique id 
      storage: isLocalhost() ? undefined : createChromeStorage<SettingsStore>(),
    }
  )
);

const getBrowserTheme = (): Theme => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? Theme.Dark : Theme.Light;
};

const setTheme = (theme: Theme) => {
  useSettingsStore.setState(() => ({ theme }))
}

const setLanguage = (language: Language) => {
  useSettingsStore.setState(() => ({ language }))
}

export const settingsStore = {
  setTheme,
  isLocalhost,
  setLanguage,
  getBrowserTheme,
  useSettingsStore,
}