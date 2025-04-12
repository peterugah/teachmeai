import { create } from "zustand"
import { Language } from "./language"


export interface SettingsStore {
  showSettings: boolean;
  language: Language;
}

const initialState: SettingsStore = {
  showSettings: false,
  language: Language.English
}

const useSettingsStore = create(() => initialState)


const setShowSettings = (showSettings: boolean) => {
  useSettingsStore.setState(() => ({ showSettings }))
}

export const settingsStore = {
  useSettingsStore,
  setShowSettings
}