import { create } from "zustand"
import { Language } from "../enums/language"
import { Theme, ThemePreference } from "../enums/theme";
import { persist } from "zustand/middleware";


export interface SettingsStore {
  theme: Theme;
  language: Language;
  themePreference: ThemePreference;
}

const initialState: SettingsStore = {
  theme: Theme.Light,
  language: Language.English,
  themePreference: ThemePreference.Browser
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    () => initialState,
    {
      name: "settings-store", //TODO: prefix it to have the user's unique id 
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
  useSettingsStore,
  getBrowserTheme,
  setLanguage,
  setTheme
}