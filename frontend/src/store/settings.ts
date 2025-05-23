import { create } from "zustand"
import { Language } from "../../../shared/languageEnum"
import { Theme, } from "../enums/theme";
import { persist } from "zustand/middleware";
import { createChromeStorage } from "./chromeStorage";
import { isLocalhost } from "../utils/isLocalHost";
import { ROOT_CONTAINER_ID } from "../constant";
import { createLocalStorage } from "./localStorage";
import { CreateUserDto, UserDto } from "@shared/types";

type IconContext = "selection" | "menuContext";
export interface SettingsStore {
  id: number;
  theme: Theme;
  email: string;
  lastName: string;
  firstName: string;
  loggedIn: boolean;
  language: Language;
  iconContext: IconContext;
  lastContentScrollTopPosition: number;
}

const initialState: SettingsStore = {
  iconContext: "selection",
  lastContentScrollTopPosition: 0,
  language: Language.English,
  theme: Theme.Dark,
  loggedIn: false,
  id: 0,
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
const setIconContext = (iconContext: IconContext) => {
  useSettingsStore.setState(() => ({ iconContext }))
}

const setLoggedIn = (loggedIn: boolean) => {
  useSettingsStore.setState(() => ({ loggedIn }))
}

const setLanguage = (language: Language) => {
  useSettingsStore.setState(() => ({ language }))
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
  useSettingsStore.setState({ lastContentScrollTopPosition })
}

const setUserDetails = (details: Pick<SettingsStore, "email" | "firstName" | "lastName" | "id">) => {
  useSettingsStore.setState(() => details)
}
export const settingsStore = {
  setTheme,
  createUser,
  isLocalhost,
  setLanguage,
  setLoggedIn,
  getLanguages,
  setUserDetails,
  setIconContext,
  getBrowserTheme,
  useSettingsStore,
  setLastContentScrollTopPosition
}