// TODO: move this to a shared file and bundle it as one for the background.ts file
enum ServiceWorkerMessageEvents {
  START_AUTH_FLOW = "START_AUTH_FLOW",
  CHECK_LOGIN_STATUS = "CHECK_LOGIN_STATUS",
  EXPLAIN_SELECTED_TEXT = "EXPLAIN_SELECTED_TEXT"
}

const TEACH_ME_AI_CONTEXT_MENU_ID = "TEACH-ME-AI-CONTEXT-MENU-ID"

// add icon to context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: TEACH_ME_AI_CONTEXT_MENU_ID,
      title: "Explain selection",
      contexts: ["selection"],
    });
  });
});

// listen for menu item click 
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== TEACH_ME_AI_CONTEXT_MENU_ID) return;
  if (!tab?.id) return;
  chrome.tabs.sendMessage(tab.id, {
    type: ServiceWorkerMessageEvents.EXPLAIN_SELECTED_TEXT
  });
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  // Login user
  if (message.type === ServiceWorkerMessageEvents.START_AUTH_FLOW) {
    startAuthFlow(sendResponse);
    return true; // keep the message channel open
  }
  // Check if user is logged in
  if (message.type === ServiceWorkerMessageEvents.CHECK_LOGIN_STATUS) {
    // TODO: move this retrieval and setting logic to the settings store
    chrome.storage.local.get("access_token", (result) => {
      const token = result.access_token;
      const isLoggedIn = Boolean(token);
      sendResponse(isLoggedIn);  // true or false
    });
    return true;
  }
});

function startAuthFlow(sendResponse: (response: unknown) => void) {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const EXTENSION_ID = chrome.runtime.id;
  const REDIRECT_URI = `https://${EXTENSION_ID}.chromiumapp.org`;

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${CLIENT_ID}` +
    `&response_type=token` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent("openid email profile")}` +
    `&prompt=consent`;

  chrome.identity.launchWebAuthFlow(
    { url: authUrl, interactive: true },
    (redirectUrl) => {
      if (chrome.runtime.lastError || !redirectUrl) {
        sendResponse({ success: false });
        return;
      }

      const params = new URL(redirectUrl).hash
        .substring(1)
        .split("&")
        .reduce((acc, part) => {
          const [key, val] = part.split("=");
          acc[key] = val;
          return acc;
        }, {} as Record<string, string>);

      const token = params.access_token;
      if (token) {
        chrome.storage.local.set({ access_token: token }, () => {
          fetchUserInfo(token, sendResponse);
        });
      } else {
        sendResponse({ success: false });
      }
    }
  );
}

function fetchUserInfo(accessToken: string, sendResponse: (response: unknown) => void) {
  fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((userInfo) => {
      sendResponse({ success: true, token: accessToken, userInfo });
    })
    .catch((error) => {
      console.error("Failed to fetch user info:", error);
      sendResponse({ success: false, error: error.message });
    });
}
