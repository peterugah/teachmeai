import { create } from "zustand"
import { ResponseType, } from "@shared/types";

interface ConversationResponse {
  timestamp: number;
  content: string;
  type: ResponseType;
}

interface ConversationStore {
  timestamp?: number;
  webPage?: string;
  context?: string;
  responses: ConversationResponse[];
}

const initialState: ConversationStore = {
  responses: []
};

const store = create(() => initialState);

const ResponseDto = (response: ConversationResponse) => {
  store.setState((store) => ({
    responses: [...store.responses, response]
  }))
}

const initializeConversation = (conversation: ConversationStore) => {
  store.setState(() => (conversation))
}

export const conversationStore = {
  ResponseDto,
  store,
  initializeConversation,
}