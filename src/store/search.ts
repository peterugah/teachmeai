import { create } from "zustand"
import { Language } from "./language";

type RequestState = "loading" | "error" | "done";
export type SearchType = "user" | "ai";

export interface SearchBaseContent {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  type: SearchType;
}

interface SearchStore {
  liked?: boolean;
  website?: string;
  searchTerms: string[];
  websiteContent?: string;
  requestState: RequestState;
  responses?: Record<string, Partial<Record<Language, SearchBaseContent[]>>>;
  sectionOne?: Record<string, Partial<Record<Language, SearchBaseContent>>>;
  sectionTwo?: Record<string, Partial<Record<Language, SearchBaseContent>>>;
}

const initialState: SearchStore = {
  searchTerms: [],
  requestState: "done",
  website: "https://www.google.com",
  websiteContent: "",
  sectionTwo: {
    "open": {
      "EN": {
        id: "1",
        type: "ai",
        timestamp: 1744383565,
        title: "testing this",
        content: `## Title
      - list item 1
      - list item 2
      - list item 3`
      }
    }
  },
  responses: {
    "open": {
      "EN": [{
        id: "2",
        title: "",
        timestamp: 1744381787,
        content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita unde suscipit autem animi, inventore amet optio sequi aut excepturi! Dolor nihil quia explicabo! Molestias, perferendis reiciendis error ducimus eaque architecto.",
        type: "user",
      },
      {
        id: "3",
        timestamp: 174437280,
        title: "",
        content: "2 hours ago",
        type: "ai",
      },
      {
        id: "4",
        title: "",
        timestamp: 1744383006,
        content: "10 minutes ago",
        type: "ai",
      }]
    }
  },

}

const useSearchStore = create<SearchStore>(() => initialState)

const setRequestState = (requestState: RequestState) => {
  useSearchStore.setState(() => ({ requestState }))
}

const getLanguageContent = (language: Language, searchTerm: string, content: Record<string, Partial<Record<Language, SearchBaseContent>>> | undefined) => {
  return content ? content[searchTerm][language]?.content || '' : '';
}

const getLanguageTitle = (language: Language, searchTerm: string, content: Record<string, Partial<Record<Language, SearchBaseContent>>> | undefined) => {
  return content ? content[searchTerm][language]?.title || '' : '';
}
const getLanguageType = (language: Language, searchTerm: string, content: Record<string, Partial<Record<Language, SearchBaseContent>>> | undefined) => {
  return content ? content[searchTerm][language]?.type || 'ai' : "ai"
}

const getLanguageId = (language: Language, searchTerm: string, content: Record<string, Partial<Record<Language, SearchBaseContent>>> | undefined) => {
  return content ? content[searchTerm][language]?.id || '' : ""
}

const getLanguageTimestamp = (language: Language, searchTerm: string, content: Record<string, Partial<Record<Language, SearchBaseContent>>> | undefined) => {
  return content ? content[searchTerm][language]?.timestamp || 0 : 0
}

const sortByTimestamp = (conversations: SearchBaseContent[]) => {
  return conversations.sort((a, b) => a.timestamp - b.timestamp);
}



export const searchStore = {
  useSearchStore,
  setRequestState,
  getLanguageId,
  sortByTimestamp,
  getLanguageContent,
  getLanguageTimestamp,
  getLanguageTitle,
  getLanguageType,
}