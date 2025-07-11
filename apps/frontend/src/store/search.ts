import { create } from "zustand"
import { ResponseDto, RequestState, ResponseType, AskDto, AskType, } from "@shared/types";
import { v4 as uuid } from "uuid"
import { END_OF_SSE_EVENT } from "@shared/constants";
import { settingsStore } from "./settings";

interface Conversation {
  id: string;
  timestamp: number;
  type: ResponseType;
  content: string;
};
interface SearchStore {
  askId: number;
  conversation: Conversation[];
  requestState: RequestState;
  pendingRequest?: Omit<AskDto, "userId">;
}

const initialState: SearchStore = {
  askId: 0,
  requestState: "done",
  conversation: [],
};


const store = create(() => initialState);

const resetStore = () => {
  store.setState(() => initialState)
}

const setPendingRequest = (pendingRequest?: AskDto) => {
  store.setState(() => ({ pendingRequest }))

}

const appendMessage = (conversation: Conversation) => {
  store.setState((state) => ({
    conversation: [...state.conversation, conversation],
  }));
};

const uploadLastAIResponse = (content: string) => {
  store.setState((state) => {
    const updated = [...state.conversation];
    const last = updated[updated.length - 1];
    if (last.type === "ai") {
      updated[updated.length - 1] = { ...last, content };
    }
    return { conversation: updated };
  });
};

const setRequestState = (requestState: RequestState) => {
  store.setState(() => ({ requestState }))
}

const setAskId = (askId: number) => {
  store.setState(() => ({ askId }))
}

const ask = async (payload: AskDto) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/search`, {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  })
  return response.json() as Promise<{ id: number }>
}
const addResponse = async (payload: ResponseDto) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/search`, {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    },
    method: "PATCH"
  })
  return response.json() as Promise<{ id: number }>
}

const handleStreamedResponse = (id: number, askType: AskType) => {
  let content = "";
  setRequestState("loading");
  appendMessage({ type: "ai", id: uuid(), timestamp: Date.now(), content: "" });

  const eventSource = askType === "firstQuestion" ? new EventSource(`${import.meta.env.VITE_BASE_URL}/search/${id}`) : new EventSource(`${import.meta.env.VITE_BASE_URL}/search/conversation/${id}`);

  eventSource.onmessage = (e) => {
    if (e.data !== END_OF_SSE_EVENT) {
      content += e.data;
      uploadLastAIResponse(content);
      setRequestState("done");
    } else {
      addResponse({
        userId: settingsStore.store.getState().id,
        askId: id,
        content,
        type: "ai"
      });
      setAskId(id);
      eventSource.close();
    }
  };

  eventSource.onerror = () => {
    setRequestState("error");
    eventSource.close();
  };
};

const requestExplanation = async (payload: AskDto) => {
  try {
    setRequestState("loading");
    const { id } = await ask(payload);
    handleStreamedResponse(id, "firstQuestion");
  } catch {
    setRequestState("error");
  }
};

const requestContinuation = async (id: number) => {
  handleStreamedResponse(id, "continuation");
};

const askQuestion = async (question: string) => {
  try {
    setRequestState("loading");
    const askId = store.getState().askId;
    appendMessage({ content: question, id: uuid(), timestamp: Date.now(), type: "user" });
    await addResponse({
      userId: settingsStore.store.getState().id,
      askId,
      content: question,
      type: "user"
    })
    await requestContinuation(askId)
  } catch {
    setRequestState("error");
  }
}

const saveRequestForLater = (pendingRequest: Omit<AskDto, "userId">) => {
  store.setState(() => ({ pendingRequest }))
}

export const searchStore = {
  store,
  resetStore,
  askQuestion,
  appendMessage,
  setRequestState,
  setPendingRequest,
  requestExplanation,
  saveRequestForLater
}