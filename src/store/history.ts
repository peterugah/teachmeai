import { create } from "zustand"
import { Language } from "./language";

interface HistoryBaseContent {
  title: string;
  content: string;
}
type RequestState = "loading" | "error" | "done";

interface HistoryDetailsContent extends HistoryBaseContent {
  liked: boolean;
}
interface HistoryStore {
  requestState: RequestState;
  website?: string;
  sectionOne?: Partial<Record<Language, HistoryBaseContent>>,
  sectionTwo?: Partial<Record<Language, HistoryDetailsContent>>,
}

const initialState: HistoryStore = {
  requestState: "done",
  sectionOne: {
    "EN": {
      content: "",
      title: "",
    }
  }
}

export const useHistoryStore = create<HistoryStore>(() => initialState)

const setRequestState = (requestState: RequestState) => {
  useHistoryStore.setState(() => ({ requestState }))
}

export const historyStore = {
  setRequestState
}