import { Language } from "@shared/languageEnum"
import { RequestState, } from "@shared/types"
import { create } from "zustand"

export interface TranslationKeys {
  logo: Partial<Record<Language, string>>
  askMore: Partial<Record<Language, string>>
  theme: Partial<Record<Language, string>>
  history: Partial<Record<Language, string>>
  settings: Partial<Record<Language, string>>
  language: Partial<Record<Language, string>>
  processing: Partial<Record<Language, string>>
  hearFromYou: Partial<Record<Language, string>>
  reportBugAskForFeature: Partial<Record<Language, string>>
  hiThere: Partial<Record<Language, string>>
  helpYou: Partial<Record<Language, string>>
  loginWithGoogle: Partial<Record<Language, string>>
  loginErrorMessage: Partial<Record<Language, string>>
  liked: Partial<Record<Language, string>>
  copied: Partial<Record<Language, string>>
  trigger: Partial<Record<Language, string>>
}

interface TranslationsStore {
  requestState: RequestState;
  translations: TranslationKeys;
}

const initialState: TranslationsStore = {
  requestState: "done",
  translations: {
    logo: {
      [Language.English]: "Logo",
    },
    askMore: {
      [Language.English]: "Ask more...",
    },
    theme: {
      [Language.English]: "Theme",
    },
    history: {
      [Language.English]: "History",
    },
    settings: {
      [Language.English]: "Settings",
    },
    language: {
      [Language.English]: "Language",
    },
    processing: {
      [Language.English]: "Processing...",
    },
    reportBugAskForFeature: {
      [Language.English]: "report bug / feature request / contact me 🙂",
    },
    hearFromYou: {
      [Language.English]: "I'd like to hear from You :)",
    },
    hiThere: {
      [Language.English]: "Hi there!",
    },
    helpYou: {
      [Language.English]: "I can't wait to help you :). Sign in to continue",
    },
    loginWithGoogle: {
      [Language.English]: "Login with Google",
    },
    loginErrorMessage: {
      [Language.English]: "Unable to login :(. Please try again or report a bug below!",
    },
    liked: {
      [Language.English]: "Liked",
    },
    copied: {
      [Language.English]: "Copied",
    },
    trigger: {
      [Language.English]: "Trigger",
    }
  }
}

const useTranslationsStore = create(() => initialState)

const setRequestState = (requestState: RequestState) => {
  useTranslationsStore.setState(() => ({ requestState }))
}

const fetchTranslations = async (language: Language) => {
  try {
    setRequestState("loading");
    console.log({ language })
    // const translations: TranslationDto[] = Object.entries(initialState.translations).map((item) => ({
    //   key: item[0],
    //   value: item[1][Language.English] || ''
    // }))
    // const body: TranslateDto = {
    //   translations,
    //   language
    // }
    // await fetch(`${import.meta.env.VITE_BASE_URL}/translation`, {
    //   method: "POST",
    //   body: JSON.stringify(body),
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    // })
    setRequestState("done");
  } catch {
    setRequestState("error");
  }
}

const translate = (key: keyof TranslationsStore["translations"], language: Language) => {
  const { translations } = useTranslationsStore.getState();
  return translations[key][language] ? translations[key][language] : translations[key][Language.English] || ''
}

export const translationStore = {
  translate,
  fetchTranslations,
  useTranslationsStore,
}