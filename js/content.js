$(function () {
    let util = {},
        cache = {
            _handlers: [
                haisen.utils.copy(haisen.message.app_crawl_lastReply, function (message, rawSender, sendResponse) {
                    module.content.services.sendBackground(haisen.message.bg_data_webRequest_queryTicket_listV2, (result) => {
                        console.log(`请求：${haisen.dict.background}，获取对应tabId的请求参数，result = ${JSON.stringify(result)}`);
                    });
                    sendResponse(haisen.response.success);
                })
            ]
        },
        memory = {},
        _ = {
            init: function () {
                this.registerPageEvent();
                this.registerListener();
                this.memoryInit();
            },
            registerPageEvent: function () {
            },
            registerListener: function () {
                chrome.runtime.onMessage.addListener((message, rawSender, sendResponse) => {
                    console.log(`Content 收到来自 ${message.from} 的消息：${JSON.stringify(message)}`);
                    for (const handler of cache._handlers) {
                        if (handler.from === message.from
                            && handler.type === message.type
                            && handler.what === message.what) {

                            handler.run(message, rawSender, sendResponse);
                            break;
                        }
                    }
                });
            },
            memoryInit: function () {

            }
        },
        module = {
            content: {
                cache: {},
                init: function () {
                },
                services: {
                    sendBackground: function (message, callback) {
                        module.content._private.addFrom(message);
                        chrome.runtime.sendMessage(message, callback);
                    }
                },
                _private: {
                    addFrom: function (message) {
                        message.from = haisen.dict.content;
                    }
                }
            }
        };

    _.init();
});