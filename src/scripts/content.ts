// import { settingsStore } from "../store/settings";

function createFloatingButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = 'teachme-ai-btn';

  button.setAttribute('aria-label', 'TeachMe AI Action');
  Object.assign(button.style, {
    position: 'absolute',
    zIndex: '9999',
    border: 'none',
    background: 'white',
    borderRadius: '50%',
    padding: '6px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('icons/info.svg');
  icon.alt = 'TeachMe AI';
  Object.assign(icon.style, {
    width: '20px',
    height: '20px',
  });

  button.appendChild(icon);
  return button;
}

function removeFloatingButton() {
  const existing = document.getElementById('teachme-ai-btn');
  if (existing) {
    existing.remove();
  }
}

function showButtonNearSelection() {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();

  if (!selection || !selectedText || selection.rangeCount === 0) {
    removeFloatingButton();
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  removeFloatingButton();

  const button = createFloatingButton();
  document.body.appendChild(button);

  // Position the button slightly above and to the right of the selection
  button.style.top = `${window.scrollY + rect.top - 36}px`;
  button.style.left = `${window.scrollX + rect.left + rect.width}px`;

  button.onclick = () => {
    console.log('TeachMe AI button clicked! ',);
    button.remove(); // optional: hide after click
  };
}

// ========== Event Listeners ==========

// Show on highlight
document.addEventListener('mouseup', () => {
  setTimeout(showButtonNearSelection, 0);
});

// Hide on ESC key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    removeFloatingButton();
    window.getSelection()?.removeAllRanges();
  }
});

// Hide when clicking outside the selection
document.addEventListener('mousedown', (event) => {
  const button = document.getElementById('teachme-ai-btn');
  if (button && !button.contains(event.target as Node)) {
    removeFloatingButton();
  }
});

// Hide if user clears the selection (e.g. double clicks then clicks away)
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  if (!selection || !selection.toString().trim()) {
    removeFloatingButton();
  }
});
