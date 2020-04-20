var bgPage = bgPage || {
    account: account
};

$(function () {
    bgPage.init();
    bgPage.bindListener();
    bgPage.consoleNormall();
});

bgPage.init = function () {

}

// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function (response) {
            if (callback) callback(response);
        });
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('收到来自content-script的消息：');
    console.log(request, sender, sendResponse);
    sendResponse('我是background，我已收到你的消息：' + JSON.stringify(request));
});

// backgrond向context_scripts发送消息
function TT() {
    sendMessageToContentScript('context_scripts你好，我是backgrond！', (response) => {
        if (response) alert('backgrond收到来自content-script的回复：' + response);
    });
}

// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function (response) {
            if (callback) callback(response);
        });
    });
}


bgPage.bindListener = function () {
    /* Message passing */
    chrome.runtime.onMessage.addListener((message, rawSender, sendResponse) => {
        switch (message.type) {
            case "app.open":
                switch (message.what) {
                    case "options":
                        if (chrome.runtime.openOptionsPage) {
                            chrome.runtime.openOptionsPage();
                        } else {
                            window.open(chrome.runtime.getURL('options.html'));
                        }
                        break;
                }
                break;
            case "app.crawl":
                switch (message.what) {
                    case "lastReply":
                        TT();
                        break;
                }
                break;
        }
        sendResponse({
            success: true,
            message: message
        });
    });

    /*chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
        switch (request.action) {
            case "app.open":
                sendResponse({
                    success: true,
                    message: "background response: 收到centent 页面同步过来的account对象."
                });
                break;
            // case "switchProject_popup":
            //     // 读取配置项,是在新tab打开页面，还是当前页面重定向
            //     bgPage.getCurrentTabData(request.projectName);
            //     sendResponse({
            //         success: true,
            //         message: "background response: 收到popup 页面切换项目."
            //     });
            //     break;
        }
    });*/
}

bgPage.getCurrentTabData = function (projectName) {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendRequest(tab.id, {action: "switchProject_bg", "projectName": projectName}, function (response) {
            console.log(response);
        });
    });
}

/**
 * 需要popup 页面来调用该方法，获取 content 发送给 bg 的 account 对象.
 */
bgPage.transAccountObjToPopup = function () {
    return bgPage.account;
}

bgPage.consoleNormall = function () {
    //console.log('%cbackground   normal!', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;');
    //console.log("%c", "margin-left: 316px;padding:100px 0px 50px 200px;line-height:50px;background:url('http://i2.s1.dpfile.com/pc/gp/eac9b51a169a02cbcacb067a4bcc045b(600x300)/thumb.jpg') no-repeat;");
}
