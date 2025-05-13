enum ServiceWorkerMessageEvents {
  CHECK_LOGIN_STATUS,
  START_AUTH_FLOW,
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === ServiceWorkerMessageEvents.START_AUTH_FLOW) {
    startAuthFlow(sendResponse);
    return true; // keep the message channel open
  }

  if (message.type === ServiceWorkerMessageEvents.CHECK_LOGIN_STATUS) {
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
      console.log("User Info:", userInfo);
      sendResponse({ success: true, token: accessToken, userInfo });
    })
    .catch((error) => {
      console.error("Failed to fetch user info:", error);
      sendResponse({ success: false, error: error.message });
    });
}
