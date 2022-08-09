var test = "1000";
chrome.storage.sync.set({'value': test}, function(){});


chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['popup.js']
    });
  });







