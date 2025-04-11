import { create } from "zustand"
import { Language } from "./language";

type RequestState = "loading" | "error" | "done";
export type SearchType = "user" | "ai";

export interface SearchBaseContent {
  title: string;
  content: string;
  timestamp: number;
  type: SearchType
}

interface SearchStore {
  requestState: RequestState;
  website?: string;
  websiteContent?: string;
  sectionOne?: Partial<Record<Language, SearchBaseContent>>;
  sectionTwo?: Partial<Record<Language, SearchBaseContent>>;
  responses?: Partial<Record<Language, SearchBaseContent[]>>;
  liked?: boolean;
}

const initialState: SearchStore = {
  requestState: "done",
  website: "https://www.google.com",
  websiteContent: "",
  sectionTwo: {
    "EN": {
      type: "ai",
      timestamp: 1744383565,
      title: "testing this",
      content: `## Title
      - list item 1
      - list item 2
      - list item 3`
    }
  },
  responses: {
    "EN": [{
      title: "",
      timestamp: 1744381787,
      content: "30 minutes ago",
      type: "user",
    },
    {
      timestamp: 174437280,
      title: "",
      content: "2 hours ago",
      type: "ai",
    },
    {
      title: "",
      timestamp: 1744383006,
      content: "10 minutes ago",
      type: "ai",
    }]
  },

}

const useSearchStore = create<SearchStore>(() => initialState)

const setRequestState = (requestState: RequestState) => {
  useSearchStore.setState(() => ({ requestState }))
}

const getLanguageContent = (language: Language, content: Partial<Record<Language, SearchBaseContent>> | undefined) => {
  return content ? content[language]?.content || '' : '';
}

const getLanguageTitle = (language: Language, content: Partial<Record<Language, SearchBaseContent>> | undefined) => {
  return content ? content[language]?.title || '' : '';
}
const getLanguageType = (language: Language, content: Partial<Record<Language, SearchBaseContent>> | undefined) => {
  return content ? content[language]?.type || 'ai' : "ai"
}

const getLanguageTimestamp = (language: Language, content: Partial<Record<Language, SearchBaseContent>> | undefined) => {
  return content ? content[language]?.timestamp || 0 : 0
}

const sortByTimestamp = (conversations: SearchBaseContent[]) => {
  return conversations.sort((a, b) => a.timestamp - b.timestamp);
}



export const searchStore = {
  useSearchStore,
  setRequestState,
  sortByTimestamp,
  getLanguageContent,
  getLanguageTimestamp,
  getLanguageTitle,
  getLanguageType,
}