import { create } from "zustand"
import { Language } from "./language"


interface SettingsStore {
  language: Language;
}

const initialState: SettingsStore = {
  language: Language.English
}

const useSettingsStore = create(() => initialState)


export const settingsStore = {
  useSettingsStore
}