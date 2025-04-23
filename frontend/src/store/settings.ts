import { create } from "zustand"
import { Language } from "../enums/language"
import { Theme, } from "../enums/theme";
import { persist } from "zustand/middleware";
import { createChromeStorage } from "./chromeStorage";
import { isLocalhost } from "../utils/isLocalHost";
import { ROOT_CONTAINER_ID } from "../constant";


export interface SettingsStore {
  theme: Theme;
  language: Language;
}

const initialState: SettingsStore = {
  theme: Theme.Dark,
  language: Language.English,
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    () => initialState,
    {
      name: `${ROOT_CONTAINER_ID}-settings-store`,
      storage: isLocalhost() ? undefined : createChromeStorage<SettingsStore>("sync"),
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