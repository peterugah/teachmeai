import { create } from "zustand"
import { Language } from "../enums/language"
import { Theme } from "../enums/theme";
import { createJSONStorage, persist } from "zustand/middleware";
import { chromeStorage } from "./chromeStorage";


export interface SettingsStore {
  showSettings: boolean;
  language: Language;
  theme: Theme;
}

const initialState: SettingsStore = {
  theme: Theme.Light,
  showSettings: false,
  language: Language.English
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    () => initialState,
    {
      name: "settings-store", //TODO: prefix it to have the user's unique id 
      storage: createJSONStorage(() => chromeStorage),

    }
  )
);


const setShowSettings = (showSettings: boolean) => {
  useSettingsStore.setState(() => ({ showSettings }))
}
const setTheme = (theme: Theme) => {
  useSettingsStore.setState(() => ({ theme }))
}
const setLanguage = (language: Language) => {
  useSettingsStore.setState(() => ({ language }))
}

export const settingsStore = {
  useSettingsStore,
  setShowSettings,
  setLanguage,
  setTheme
}