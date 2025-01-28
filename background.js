const timeLimit = 6000; // 30 seconds
const blockTime = 1000; // 10 seconds for holding button

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.includes("reddit.com") && changeInfo.status === "complete") {
    startTimer(tabId);
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  clearStoredTimer(tabId);
});

function startTimer(tabId) {
  clearStoredTimer(tabId);
  const endTime = Date.now() + timeLimit;
  chrome.storage.local.set({ [`tab_${tabId}`]: endTime });

  const timer = setInterval(() => {
    checkTimer(tabId, timer);
  }, 1000);
}

function checkTimer(tabId, timer) {
  chrome.storage.local.get([`tab_${tabId}`], (result) => {
    const endTime = result[`tab_${tabId}`];
    if (Date.now() >= endTime) {
      clearInterval(timer);
      blockSite(tabId);
    }
  });
}

function clearStoredTimer(tabId) {
  chrome.storage.local.remove(`tab_${tabId}`);
}

function blockSite(tabId) {
  console.log(`Blocking site for tab ${tabId}`);
  chrome.storage.local.set({ [`tab_${tabId}_blocked`]: true });
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["block.js"]
  }).then(() => {
    console.log(`Script executed to block tab ${tabId}`);
  }).catch((error) => {
    console.error(`Failed to execute script: ${error}`);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "unblock") {
    console.log('Received unblock message, reloading tab...');
    chrome.storage.local.remove(`tab_${sender.tab.id}_blocked`);
    chrome.tabs.reload(sender.tab.id);
  }
});
