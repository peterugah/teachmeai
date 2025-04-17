import { create } from "zustand"


export type ElementPosition = { top: number, left: number }
export type ElementDimensions = { width: number, height: number }

export interface VisibilityStore {
  showPopup: boolean;
  showSettings: boolean;
  position: ElementPosition;
}

const initialState: VisibilityStore = {
  showPopup: false,
  showSettings: false,
  position: {
    top: 0,
    left: 0
  }
}

const useVisibilityStore = create(() => initialState);

const setShowSettings = (showSettings: boolean) => {
  useVisibilityStore.setState(() => ({ showSettings }))
}
const setPosition = (position: ElementPosition) => {
  useVisibilityStore.setState(() => ({ position }))
}

const setShowPopup = (showPopup: boolean) => {
  useVisibilityStore.setState(() => ({ showPopup }))
}

export const getComponentPosition = (
  rect: DOMRect,
  iconWidth: number,
  iconHeight: number
) => {
  const { innerWidth, innerHeight } = window;

  let top = rect.top + window.scrollY;
  let left = rect.left + window.scrollX;

  if (rect.right + iconWidth < innerWidth) {
    top += rect.height / 2 - iconHeight / 2;
    left = rect.right + window.scrollX;
  } else if (rect.bottom + iconHeight < innerHeight) {
    top = rect.bottom + window.scrollY;
    left += rect.width / 2 - iconWidth / 2;
  } else if (rect.top - iconHeight > 0) {
    top = rect.top + window.scrollY - iconHeight;
    left += rect.width / 2 - iconWidth / 2;
  } else {
    top += rect.height / 2 - iconHeight / 2;
    left = rect.left + window.scrollX - iconWidth;
  }

  return { top, left };
};

export const visibilityStore = {
  setPosition,
  setShowPopup,
  setShowSettings,
  useVisibilityStore,
  getComponentPosition,
}