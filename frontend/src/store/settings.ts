import { create } from "zustand"
import { Language } from "../../../shared/languageEnum"
import { Theme, } from "../enums/theme";
import { persist } from "zustand/middleware";
import { createChromeStorage } from "./chromeStorage";
import { isLocalhost } from "../utils/isLocalHost";
import { ROOT_CONTAINER_ID } from "../constant";
import { createLocalStorage } from "./localStorage";


export interface SettingsStore {
  theme: Theme;
  language: Language;
  loggedIn: boolean;
  firstName: string;
  lastName: string;
  email: string;
}

const initialState: SettingsStore = {
  theme: Theme.Dark,
  language: Language.English,
  loggedIn: false,
  firstName: "",
  lastName: "",
  email: ""
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    () => initialState,
    {
      name: `${ROOT_CONTAINER_ID}-settings-store`,
      storage: isLocalhost() ? createLocalStorage<SettingsStore>() : createChromeStorage<SettingsStore>("sync"),
    }
  )
);

const getLanguages = () => {
  return Object.entries(Language)
}

const getBrowserTheme = (): Theme => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? Theme.Dark : Theme.Light;
};

const setTheme = (theme: Theme) => {
  useSettingsStore.setState(() => ({ theme }))
}

const setLoggedIn = (loggedIn: boolean) => {
  useSettingsStore.setState(() => ({ loggedIn }))
}

const setLanguage = (language: Language) => {
  useSettingsStore.setState(() => ({ language }))
}
const setFirstName = (firstName: string) => {
  useSettingsStore.setState(() => ({ firstName }))
}
const setLastName = (lastName: string) => {
  useSettingsStore.setState(() => ({ lastName }))
}

const setEmail = (email: string) => {
  useSettingsStore.setState(() => ({ email }))
}

export const settingsStore = {
  setTheme,
  setEmail,
  isLocalhost,
  setLanguage,
  setLoggedIn,
  setLastName,
  setFirstName,
  getLanguages,
  getBrowserTheme,
  useSettingsStore,
}