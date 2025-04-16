import { ROOT_CONTAINER_ID } from "../constant";

export const showInfoIcon = () => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;

  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  const range = selection.getRangeAt(0);
  const node = range.commonAncestorContainer;

  const element =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as Element)
      : node.parentElement;

  if (!element) return;

  const isInsideExtension = element.closest(ROOT_CONTAINER_ID) !== null;

  if (!isInsideExtension) {
    console.log("✅ Selection outside extension:", selectedText);
  }
}
