import { create } from "zustand"
import { Language } from "../enums/language";
import { persist } from "zustand/middleware";
import { ROOT_CONTAINER_ID } from "../constant";
import { AskDto, RequestState, SearchBaseContent, SearchSectionTwo } from "@shared/types";
import { END_OF_SSE_EVENT } from "@shared/constants";
import { isLocalhost } from "../utils/isLocalHost";
import { createChromeStorage } from "./chromeStorage";

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
  activeWebPage: string;
  activeSearchTerm: string;
  requestState: RequestState;
  responses?: Record<string, Record<string, Partial<Record<Language, SearchBaseContent[]>>>>;
  sectionOne?: Record<string, Record<string, Partial<Record<Language, SearchBaseContent>>>>;
  sectionTwo?: Record<string, Record<string, Partial<Record<Language, SearchSectionTwo>>>>;
}

// const initialState: SearchStore = {
//   requestState: "done",
//   sectionOne: {
//     "www.example.com": {
//       "open": {
//         "EN": {
//           webPage: "www.example.com",
//           id: "10",
//           type: "ai",
//           timestamp: 1744383565,
//           title: "Pronunciation",
//           content: "the-way-of-the-lord",
//         }
//       }
//     }
//   },
//   sectionTwo: {
//     "www.example.com": {
//       "open": {
//         "EN": {
//           webPage: "www.example.com",
//           id: "1",
//           type: "ai",
//           timestamp: 1744383565,
//           title: "testing this",
//           mainReference: true,
//           content: `this is some demo conetnt here...`
//         },
//       },
//       "add": {
//         "EN": {
//           webPage: "www.example.com",
//           id: "22",
//           type: "ai",
//           timestamp: 1744383565,
//           title: "the thesis of the universe ahsdhasd ashd ashd ",
//           mainReference: true,
//           content: `## Title
//       - list item 1
//       - list item 2
//       - list item 3`
//         },
//       },
//       "three": {
//         "EN": {
//           webPage: "www.example.com",
//           id: "222",
//           type: "ai",
//           timestamp: 1744383565,
//           title: "the thesis of the ahsdhasd ashd ashd ",
//           mainReference: true,
//           content: `## Title
//       - list item 1
//       - list item 2
//       - list item 3`
//         },
//       },
//       "four": {
//         "EN": {
//           webPage: "www.example.com",
//           id: "2222",
//           type: "ai",
//           timestamp: 1744383565,
//           title: "the thesis of the ahsdhasasdasdd ashd ashd ",
//           mainReference: true,
//           content: `## Title
//       - list item 1
//       - list item 2
//       - list item 3`
//         },
//       },
//       "five": {
//         "EN": {
//           webPage: "www.example.com",
//           id: "2222222",
//           type: "ai",
//           timestamp: 1744383565,
//           title: "the thesis of ashd ashd ",
//           mainReference: true,
//           content: `## Title
//       - list item 1
//       - list item 2
//       - list item 3`
//         },
//       }
//     }
//   },
//   responses: {
//     "www.example.com": {
//       "open": {
//         "EN": [{
//           webPage: "",
//           id: "2",
//           title: "",
//           timestamp: 1744381787,
//           content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita unde suscipit autem animi, inventore amet optio sequi aut excepturi! Dolor nihil quia explicabo! Molestias, perferendis reiciendis error ducimus eaque architecto.",
//           type: "user",
//         },
//         {
//           webPage: "",
//           id: "3",
//           timestamp: 174437280,
//           title: "",
//           content: "2 hours ago",
//           type: "ai",

//         },
//         {
//           webPage: "",
//           id: "4",
//           title: "",
//           timestamp: 1744383006,
//           content: "10 minutes ago",
//           type: "ai",
//         }]
//       }
//     }
//   },

// }

const initialState: SearchStore = {
  activeSearchTerm: "",
  activeWebPage: "",
  requestState: "done",
  sectionOne: {},
  sectionTwo: {},
  responses: {},
};

const useSearchStore = create<SearchStore>()(
  persist(
    () => initialState,
    {
      name: `${ROOT_CONTAINER_ID}-search-store`,
      storage: isLocalhost() ? undefined : createChromeStorage<SearchStore>("local"),
    }
  )
);

const setSectionTwo = (data: Record<string, Record<string, Partial<Record<Language, SearchSectionTwo>>>>) => {
  useSearchStore.setState((store) => ({ sectionTwo: { ...store.sectionTwo, data } }))
}

const setActiveSearchTerm = (activeSearchTerm: string) => {
  useSearchStore.setState(() => ({ activeSearchTerm }))
}

const setActiveWebPage = (activeWebPage: string) => {
  useSearchStore.setState(() => ({ activeWebPage }))
}

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

const convertAskPayloadToQueryString = (payload: AskDto) => {
  const query = new URLSearchParams({
    additionalContext: JSON.stringify(payload.additionalContext),
    content: payload.content,
    id: payload.id,
    language: payload.language,
    searchTerm: payload.searchTerm,
    timestamp: String(payload.timestamp),
    webPage: payload.webPage
  }).toString();
  return query;
}

const constructSectionForAsk = (payload: AskDto) => {
  return {
    [payload.webPage]: {
      [payload.searchTerm]: {
        [payload.language]: {
          id: payload.id,
          mainReference: true,
          timestamp: payload.timestamp,
          title: payload.searchTerm,
          type: "ai",
          webPage: payload.webPage,
          content: payload.content
        } as SearchSectionTwo
      }
    }
  }
}

const requestExplanation = (payload: AskDto) => {
  const query = convertAskPayloadToQueryString(payload)
  let content = "";
  setRequestState("loading")
  const eventSource = new EventSource(`${import.meta.env.VITE_BASE_URL}/search/ask?${query}`,);

  eventSource.onmessage = (e) => {
    if (e.data !== END_OF_SSE_EVENT) {
      content += e.data;
      // TODO: remove
      setSectionTwo(constructSectionForAsk({ ...payload, content }))
    } else {
      eventSource.close()
      setRequestState("done");
      setSectionTwo(constructSectionForAsk({ ...payload, content }))
      setActiveSearchTerm(payload.searchTerm);
      setActiveWebPage(payload.webPage);
    }
  }

  eventSource.onerror = (e) => {
    console.log(e)
    eventSource.close()
    setRequestState("error");
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