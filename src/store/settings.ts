import { create } from "zustand"
import { Language } from "../enums/language"
import { Theme } from "../enums/theme";
import { persist } from "zustand/middleware";


export interface SettingsStore {
  language: Language;
  theme: Theme;
}

const initialState: SettingsStore = {
  theme: Theme.Light,
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


const setTheme = (theme: Theme) => {
  useSettingsStore.setState(() => ({ theme }))
}
const setLanguage = (language: Language) => {
  useSettingsStore.setState(() => ({ language }))
}

export const settingsStore = {
  useSettingsStore,
  setLanguage,
  setTheme
}