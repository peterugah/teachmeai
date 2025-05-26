import { create } from "zustand"
interface SelectionStore {
  webPage?: string;
  searchTerm?: string;
}

const initialState: SelectionStore = {
};

const store = create(() => initialState);

const setSelection = (selection: SelectionStore) => {
  store.setState(() => (selection))
}

export const selectionStore = {
  store,
  setSelection,
}