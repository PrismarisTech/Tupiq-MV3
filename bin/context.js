chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        "id": "about-background",
        "title": 'About this Background',
        "contexts": ["page"],
        "documentUrlPatterns": ['chrome-extension://*/index.html']
    });

    chrome.contextMenus.create({
        "id": "toggle-panel",
        "title": 'Toggle Panel',
        "contexts": ["page"],
        "documentUrlPatterns": ['chrome-extension://*/index.html']
    });

    chrome.contextMenus.create({
        "id": "settings",
        "title": 'Settings',
        "contexts": ["page"],
        "documentUrlPatterns": ['chrome-extension://*/index.html']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "about-background") {
        chrome.runtime.sendMessage({
            getBackgroundInfo: true
        });
    } else if (info.menuItemId === "toggle-panel") {
        chrome.runtime.sendMessage({
            minimisePanel: true
        });
    } else if (info.menuItemId === "settings") {
        chrome.runtime.sendMessage({
            settings: true
        });
    }
});
