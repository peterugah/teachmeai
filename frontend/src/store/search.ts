import { create } from "zustand"
import { RequestState, ResponseType, SearchDto, } from "@shared/types";
import { END_OF_SSE_EVENT } from "@shared/constants";
import { v4 as uuid } from "uuid"
import { settingsStore } from "./settings";

interface Conversation {
  id: string;
  timestamp: number;
  type: ResponseType;
  content: string;
};
interface SearchStore {
  conversation: Conversation[];
  requestState: RequestState;
}

const initialState: SearchStore = {
  requestState: "done",
  conversation: [],
};

const useSearchStore = create(() => initialState);

const resetStore = () => {
  useSearchStore.setState(() => initialState)
}

const appendMessage = (conversation: Conversation) => {
  useSearchStore.setState((state) => ({
    conversation: [...state.conversation, conversation],
  }));
};

const uploadLastAIResponse = (content: string) => {
  useSearchStore.setState((state) => {
    const updated = [...state.conversation];
    const last = updated[updated.length - 1];
    if (last.type === "ai") {
      updated[updated.length - 1] = { ...last, content };
    }
    return { conversation: updated };
  });
};


const setRequestState = (requestState: RequestState) => {
  useSearchStore.setState(() => ({ requestState }))
}

const requestExplanation = (payload: Omit<SearchDto, "language">) => {
  setRequestState("loading");
  const query = new URLSearchParams({
    context: payload.context,
    searchTerm: payload.searchTerm,
    language: settingsStore.useSettingsStore.getState().language
  }).toString();

  let content = "";

  appendMessage({ type: "ai", id: uuid(), timestamp: Date.now(), content: "" });

  const eventSource = new EventSource(`${import.meta.env.VITE_BASE_URL}/search/ask-stream?${query}`)

  eventSource.onmessage = (e) => {
    if (e.data !== END_OF_SSE_EVENT) {
      content += e.data;
      uploadLastAIResponse(content);
      setRequestState("done");
    } else {
      eventSource.close();
    }
  }

  eventSource.onerror = () => {
    setRequestState("error");
    eventSource.close();
  }
}

const askQuestion = (question: string) => {
  appendMessage({ content: question, id: uuid(), timestamp: Date.now(), type: "user" });
  requestExplanation({
    context: useSearchStore.getState().conversation.join(" "),
    searchTerm: question
  })
}


export const searchStore = {
  resetStore,
  askQuestion,
  appendMessage,
  useSearchStore,
  setRequestState,
  requestExplanation,
}