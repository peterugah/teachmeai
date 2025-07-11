import { create } from "zustand"
import { Theme, } from "../enums/theme";
import { persist } from "zustand/middleware";
import { createChromeStorage } from "./chromeStorage";
import { isLocalhost } from "../utils/isLocalHost";
import { ROOT_CONTAINER_ID } from "../constant";
import { createLocalStorage } from "./localStorage";
import { CreateUserDto, UserDto } from "@shared/types";
import { Language } from "@shared/languageEnum";

export const TRIGGER_TYPES = ["Icon", "Menu Item"] as const;

export type TriggerType = typeof TRIGGER_TYPES[number];
export interface SettingsStore {
  id: number;
  theme: Theme;
  email: string;
  lastName: string;
  firstName: string;
  loggedIn: boolean;
  language: Language;
  trigger: TriggerType;
  lastContentScrollTopPosition: number;
}

const initialState: SettingsStore = {
  trigger: "Icon",
  lastContentScrollTopPosition: 0,
  language: Language.English,
  theme: Theme.Dark,
  loggedIn: false,
  id: 0,
  firstName: "",
  lastName: "",
  email: ""
}

const store = create<SettingsStore>()(
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
  store.setState(() => ({ theme }))
}
const setTrigger = (trigger: TriggerType) => {
  store.setState(() => ({ trigger }))
}

const setLoggedIn = (loggedIn: boolean) => {
  store.setState(() => ({ loggedIn }))
}

const setLanguage = (language: Language) => {
  store.setState(() => ({ language }))
}

const createUser = async (payload: CreateUserDto) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user`, {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  })
  return response.json() as Promise<UserDto>
}

const setLastContentScrollTopPosition = (lastContentScrollTopPosition: number) => {
  store.setState({ lastContentScrollTopPosition })
}

const setUserDetails = (details: Pick<SettingsStore, "email" | "firstName" | "lastName" | "id">) => {
  store.setState(() => details)
}
export const settingsStore = {
  store,
  setTheme,
  createUser,
  isLocalhost,
  setLanguage,
  setLoggedIn,
  getLanguages,
  setUserDetails,
  getBrowserTheme,
  setTrigger,
  setLastContentScrollTopPosition
}