import { create } from "zustand"
import { Language } from "./language";

type RequestState = "loading" | "error" | "done";
export type SearchType = "user" | "ai";

export interface SearchBaseContent {
  webPage: string;
  id: string;
  title: string;
  content: string;
  timestamp: number;
  type: SearchType;
}
/**
  Structure  
{
  "webPage" : {
    "word_or_sentence" : {
      "language" : {
        ...SearchBaseContent
      }
    }
  }
}
 */
interface SearchStore {
  liked?: boolean;
  website?: string;
  requestState: RequestState;
  responses?: Record<string, Record<string, Partial<Record<Language, SearchBaseContent[]>>>>;
  sectionOne?: Record<string, Record<string, Partial<Record<Language, SearchBaseContent>>>>;
  sectionTwo?: Record<string, Record<string, Partial<Record<Language, SearchBaseContent>>>>;
}

const initialState: SearchStore = {
  requestState: "done",
  sectionOne: {
    "www.example.com": {
      "open": {
        "EN": {
          webPage: "",
          id: "10",
          type: "ai",
          timestamp: 1744383565,
          title: "Pronunciation",
          content: "the-way-of-the-lord",
        }
      }
    }
  },
  sectionTwo: {
    "www.example.com": {
      "open": {
        "EN": {
          webPage: "",
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
    }
  },
  responses: {
    "www.example.com": {
      "open": {
        "EN": [{
          webPage: "",
          id: "2",
          title: "",
          timestamp: 1744381787,
          content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita unde suscipit autem animi, inventore amet optio sequi aut excepturi! Dolor nihil quia explicabo! Molestias, perferendis reiciendis error ducimus eaque architecto.",
          type: "user",
        },
        {
          webPage: "",
          id: "3",
          timestamp: 174437280,
          title: "",
          content: "2 hours ago",
          type: "ai",
        },
        {
          webPage: "",
          id: "4",
          title: "",
          timestamp: 1744383006,
          content: "10 minutes ago",
          type: "ai",
        }]
      }
    }
  },

}

const useSearchStore = create<SearchStore>(() => initialState)

const setRequestState = (requestState: RequestState) => {
  useSearchStore.setState(() => ({ requestState }))
}

const getLanguageContent = (language: Language, webPage: string, searchTerm: string, content: Record<string, Record<string, Partial<Record<Language, SearchBaseContent>>>> | undefined) => {
  return content ? content[webPage][searchTerm][language]?.content || '' : '';
}

const getLanguageTitle = (language: Language, webPage: string, searchTerm: string, content: Record<string, Record<string, Partial<Record<Language, SearchBaseContent>>>> | undefined) => {
  return content ? content[webPage][searchTerm][language]?.title || '' : '';
}
const getLanguageType = (language: Language, webPage: string, searchTerm: string, content: Record<string, Record<string, Partial<Record<Language, SearchBaseContent>>>> | undefined) => {
  return content ? content[webPage][searchTerm][language]?.type || 'ai' : "ai"
}

const getLanguageId = (language: Language, webPage: string, searchTerm: string, content: Record<string, Record<string, Partial<Record<Language, SearchBaseContent>>>> | undefined) => {
  return content ? content[webPage][searchTerm][language]?.id || '' : ""
}

const getLanguageTimestamp = (language: Language, webPage: string, searchTerm: string, content: Record<string, Record<string, Partial<Record<Language, SearchBaseContent>>>> | undefined) => {
  return content ? content[webPage][searchTerm][language]?.timestamp || 0 : 0
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