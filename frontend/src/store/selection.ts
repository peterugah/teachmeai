import { create } from "zustand"
interface SelectionStore {
  webPage?: string;
  searchTerm?: string;
}

const initialState: SelectionStore = {
};

const useSelectionStore = create(() => initialState);

const setSelection = (selection: SelectionStore) => {
  useSelectionStore.setState(() => (selection))
}

export const selectionStore = {
  useSelectionStore,
  setSelection,
}