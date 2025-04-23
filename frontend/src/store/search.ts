import { create } from "zustand"
import { Language } from "../enums/language";
import { persist } from "zustand/middleware";
import { ROOT_CONTAINER_ID } from "../constant";
import { AskDto, RequestState, SearchBaseContent, SearchSectionTwo } from "@shared/types";

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
  sectionTwo?: Record<string, Record<string, Partial<Record<Language, SearchSectionTwo>>>>;
}

const initialState: SearchStore = {
  requestState: "done",
  sectionOne: {
    "www.example.com": {
      "open": {
        "EN": {
          webPage: "www.example.com",
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
          webPage: "www.example.com",
          id: "1",
          type: "ai",
          timestamp: 1744383565,
          title: "testing this",
          mainReference: true,
          content: `this is some demo conetnt here...`
        },
      },
      "add": {
        "EN": {
          webPage: "www.example.com",
          id: "22",
          type: "ai",
          timestamp: 1744383565,
          title: "the thesis of the universe ahsdhasd ashd ashd ",
          mainReference: true,
          content: `## Title
      - list item 1
      - list item 2
      - list item 3`
        },
      },
      "three": {
        "EN": {
          webPage: "www.example.com",
          id: "222",
          type: "ai",
          timestamp: 1744383565,
          title: "the thesis of the ahsdhasd ashd ashd ",
          mainReference: true,
          content: `## Title
      - list item 1
      - list item 2
      - list item 3`
        },
      },
      "four": {
        "EN": {
          webPage: "www.example.com",
          id: "2222",
          type: "ai",
          timestamp: 1744383565,
          title: "the thesis of the ahsdhasasdasdd ashd ashd ",
          mainReference: true,
          content: `## Title
      - list item 1
      - list item 2
      - list item 3`
        },
      },
      "five": {
        "EN": {
          webPage: "www.example.com",
          id: "2222222",
          type: "ai",
          timestamp: 1744383565,
          title: "the thesis of ashd ashd ",
          mainReference: true,
          content: `## Title
      - list item 1
      - list item 2
      - list item 3`
        },
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

const useSearchStore = create<SearchStore>()(
  persist(
    () => initialState,
    {
      name: `${ROOT_CONTAINER_ID}-search-store`,
    }
  )
);


const setRequestState = (requestState: RequestState) => {
  useSearchStore.setState(() => ({ requestState }))
}

const getDetailsForSearchTerm = (webPage: string, searchTerm: string, language: Language) => {
  const sectionOne = useSearchStore.getState().sectionOne;
  const sectionTwo = useSearchStore.getState().sectionTwo;
  const responses = useSearchStore.getState().responses;

  return {
    sectionOne: sectionOne && sectionOne[webPage] && sectionOne[webPage][searchTerm] && sectionOne[webPage][searchTerm][language] ? sectionOne[webPage][searchTerm][language] : undefined,
    sectionTwo: sectionTwo && sectionTwo[webPage] && sectionTwo[webPage][searchTerm] && sectionTwo[webPage][searchTerm][language] ? sectionTwo[webPage][searchTerm][language] : undefined,
    responses: responses && responses[webPage] && responses[webPage][searchTerm] && responses[webPage][searchTerm][language] ? responses[webPage][searchTerm][language] : []
  }
}

const sortByTimestamp = (conversations: SearchBaseContent[]) => {
  return conversations.sort((a, b) => a.timestamp - b.timestamp);
}

const getLanguages = () => {
  return Object.entries(Language)
}

const getPreviousSearches = () => {
  const response: SearchSectionTwo[] = [];
  const sectionTwo = useSearchStore.getState().sectionTwo;
  for (const webPage in sectionTwo) {
    const searchTerms = sectionTwo[webPage];
    for (const term in searchTerms) {
      const languages = searchTerms[term];
      for (const lang in languages) {
        const obj = languages[lang as Language];
        if (obj?.mainReference) {
          response.push(obj)
        }
      }
    }
  }
  return response;
}

const requestExplanation = (payload: AskDto) => {
  setRequestState("loading")
  const eventSource = new EventSource(`${import.meta.env.VITE_BASE_URL}/search/ask`);
  eventSource.onmessage = (e) => {
    setRequestState("done");

  }

}

export const searchStore = {
  getDetailsForSearchTerm,
  getPreviousSearches,
  requestExplanation,
  useSearchStore,
  setRequestState,
  sortByTimestamp,
  getLanguages
}