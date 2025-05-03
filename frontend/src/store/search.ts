import { create } from "zustand"
import { ResponseDto, RequestState, ResponseType, AskDto, AskType, } from "@shared/types";
import { v4 as uuid } from "uuid"
import { END_OF_SSE_EVENT } from "@shared/constants";

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
}

const initialState: SearchStore = {
  askId: 0,
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
const setAskId = (askId: number) => {
  useSearchStore.setState(() => ({ askId }))
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
    const askId = useSearchStore.getState().askId;
    appendMessage({ content: question, id: uuid(), timestamp: Date.now(), type: "user" });
    await addResponse({
      askId,
      content: question,
      type: "user"
    })
    requestContinuation(askId)
  } catch {
    setRequestState("error");
  }
}


export const searchStore = {
  resetStore,
  askQuestion,
  appendMessage,
  useSearchStore,
  setRequestState,
  requestExplanation,
}