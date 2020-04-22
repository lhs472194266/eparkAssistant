$(function () {
    let util = {},
        response = haisen.response,
        message = haisen.message,
        cache = {
            tabs: {},
            currentTabId: undefined,    // 通过缓存来结果
            currentVersion: undefined,
            _handlers: [
                haisen.utils.copy(message.app_open_options, function (message, rawSender, sendResponse) {
                    if (chrome.runtime.openOptionsPage) {
                        chrome.runtime.openOptionsPage();
                    } else {
                        window.open(chrome.runtime.getURL('options.html'));
                    }
                    sendResponse(response.success);
                }),
                haisen.utils.copy(message.bg_data_webRequest_queryTicket_listV2, function (message, rawSender, sendResponse) {
                    sendResponse(response.successData(cache.webRequest.queryTicket_listV2.details[cache.currentTabId]));
                }),
                /*haisen.utils.copy(message.app_open_console, function (message, rawSender, sendResponse) {
                    chrome.tabs.create({url: haisen.message.app_open_console.baidu}, (tab) => {
                        sendResponse(response.successData({tabId: tab.id}));
                    });
                }),*/
            ],
            webRequest: {
                queryTicket_listV2: {
                    what: "lastReply",
                    url: "http://*/*/queryTicket_listV2.action?*",
                    reg: "http:\/\/.*?\/queryTicket_listV2\.action\?.*?",
                    details: {}     // 按照tabId 来缓存
                }
            },
        },
        memory = {},
        _ = {
            init: function () {
                cache.currentVersion = chrome.runtime.getManifest().version;

                this.registerPageEvent();
                this.registerListener();
                this.memoryInit();

                // https://zhuanlan.zhihu.com/p/47469896
                /*chrome.contextMenus.create({
                    type: 'normal',
                    title: '待完善',
                    id: 'menuDemo',
                    contexts: ['all'],
                    onclick: function () {
                    }
                }, function () {
                    console.log('contextMenus are create.');
                });*/
            },
            registerPageEvent: function () {

            },
            memoryInit: function () {

            },
            registerListener: function () {
                // Subscribe to tab events
                chrome.tabs.onCreated.addListener((tab) => {
                    cache.tabs[tab.id] = tab;
                    cache.currentTabId = tab.id;
                    // console.log(cache.currentTabId);
                });
                chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
                    delete cache.tabs[tab.id];
                });
                chrome.tabs.onActivated.addListener((activeInfo) => {
                    cache.currentTabId = activeInfo.tabId;
                });

                // 不能运行在 content 里
                chrome.webRequest.onBeforeRequest.addListener((details) => {
                        console.log(`监听到符合规则的请求：${details.url}，method：${details.method}，tabId：${details.tabId}`)
                        for (let prop in cache.webRequest) {
                            if (new RegExp(cache.webRequest[prop].reg, "gi").test(details.url)) {
                                if (details.requestBody === undefined) {
                                    // 防止null异常，并且如果GET顺便清空
                                    details.requestBody = {
                                        formData: {}
                                    }
                                }

                                let temp = {};
                                // todo 等遇到多值的情况在再说
                                for (let prop in details.requestBody.formData) {
                                    temp[prop] = details.requestBody.formData[prop][0];
                                }
                                details.requestBody.formData = temp;

                                cache.webRequest[prop].details[details.tabId] = details;    // content 还需要URL呢
                                console.log(`缓存：${details.tabId}，${details.url}\n参数：${JSON.stringify(details.requestBody.formData, undefined, 4)}`);

                                break;
                            }
                        }
                    }, {
                        urls: [cache.webRequest.queryTicket_listV2.url]
                    },
                    ["requestBody"]
                );

                chrome.runtime.onMessage.addListener((message, rawSender, sendResponse) => {
                        console.log(`Background 收到来自 ${message.from} 的消息：${JSON.stringify(message)}`);
                        for (const handler of cache._handlers) {
                            if (handler.from === message.from
                                && handler.type === message.type
                                && handler.what === message.what) {

                                handler.run(message, rawSender, sendResponse);
                                return true;    // 这是重点，it's important
                            }
                        }
                    }
                );
            }
        },
        module = {
            bg: {
                cache: {},
                init: function () {
                },
                services: {
                    sendContent: function (message, callback) {
                        module.popup._private.addFrom(message);
                        chrome.tabs.sendMessage(cache.currentTabId, message, function (response) {
                            if (callback) callback(response);
                        });
                    },
                    sendPopup: function (message, callback) {
                        module.popup._private.addFrom(message);
                        chrome.runtime.sendMessage(message, callback);
                    }
                },
                _private: {
                    addFrom: function (message) {
                        message.from = haisen.dict.background;
                    }
                }
            }
        };

    _.init();
});

