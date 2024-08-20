import { MouseTimeResponse } from "../popup/src/Popup";

const siteData: MouseTimeResponse = {};

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === "mouse-move") {
    const { timeSpent, hostname } = message;
    if (!siteData[hostname]) {
      siteData[hostname] = 0;
    }
    siteData[hostname] += timeSpent;

    chrome.storage.local.set({ siteData });
  } else if (message.type === "get-data") {
    chrome.storage.local.get("siteData", (data) => {
      console.log("send", data);
      sendResponse(data.siteData || {});
    });
    return true;
  }
});
