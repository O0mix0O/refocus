chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "resetTimer") {
    chrome.runtime.sendMessage({ action: "resetTimer" });
  }
});
