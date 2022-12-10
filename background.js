// This will run in the background

// Load toggle state from chrome storage
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      let status = await chrome.storage.local.get(["monochrome"]);
      await chrome.tabs.sendMessage(tab.id, {
        monochrome: status["monochrome"],
      });
    })();
  }
});

// Update toggle state on message recieve
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.monochrome === true) {
    chrome.storage.local.set({ monochrome: true });
  } else {
    chrome.storage.local.set({ monochrome: false });
  }
});
