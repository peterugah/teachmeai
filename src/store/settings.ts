import { create } from "zustand"
import { Language } from "../enums/language"
import { Theme } from "../enums/theme";
import { persist } from "zustand/middleware";


export interface SettingsStore {
  showPopup: boolean;
  showSettings: boolean;
  language: Language;
  theme: Theme;
}

const initialState: SettingsStore = {
  showPopup: false,
  theme: Theme.Light,
  showSettings: false,
  language: Language.English
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    () => initialState,
    {
      name: "settings-store", //TODO: prefix it to have the user's unique id 
    }
  )
);

const setShowSettings = (showSettings: boolean) => {
  useSettingsStore.setState(() => ({ showSettings }))
}
const setShowPopup = (showPopup: boolean) => {
  useSettingsStore.setState(() => ({ showPopup }))
}
const setTheme = (theme: Theme) => {
  useSettingsStore.setState(() => ({ theme }))
}
const setLanguage = (language: Language) => {
  useSettingsStore.setState(() => ({ language }))
}

export const settingsStore = {
  useSettingsStore,
  setShowPopup,
  setShowSettings,
  setLanguage,
  setTheme
}