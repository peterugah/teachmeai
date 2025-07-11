import { create } from "zustand"


export interface VisibilityStore {
  showPopup: boolean;
  showSettings: boolean;
  showInfoIcon: boolean;
}

const initialState: VisibilityStore = {
  showPopup: false,
  showInfoIcon: false,
  showSettings: false,

}

const store = create(() => initialState);

const setShowSettings = (showSettings: boolean) => {
  store.setState(() => ({ showSettings }))
}



const setShowPopup = (showPopup: boolean) => {
  store.setState(() => ({ showPopup }))
}

const setShowInfoIcon = (showInfoIcon: boolean) => {
  store.setState(() => ({ showInfoIcon }))
}


export const visibilityStore = {
  setShowPopup,
  setShowSettings,
  setShowInfoIcon,
  store,
}