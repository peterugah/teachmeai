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

const useConversationStore = create(() => initialState);

const addResponse = (response: ConversationResponse) => {
  useConversationStore.setState((store) => ({
    responses: [...store.responses, response]
  }))
}

const initializeConversation = (conversation: ConversationStore) => {
  useConversationStore.setState(() => (conversation))
}

export const conversationStore = {
  addResponse,
  useConversationStore,
  initializeConversation,
}