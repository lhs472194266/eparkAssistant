$(function () {
    let util = {},
        response = haisen.response,
        message = haisen.message,
        cache = {
            _handlers: [
                haisen.utils.copy(message.output_to_console, function (message, rawSender, sendResponse) {
                    sendResponse({ssss: 123});
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
            memoryInit: function () {

            },
            registerListener: function () {
                chrome.runtime.onMessage.addListener((message, rawSender, sendResponse) => {
                        console.log(`Console 收到来自 ${message.from} 的消息：${JSON.stringify(message)}`);
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

                /*let port = chrome.runtime.connect({name: "console"});// 通道名称
                port.onMessage.addListener(function (msg) {//监听消息
                    console.log(msg);
                });*/
                window.addEventListener('message', (e) => {
                    console.log(e.data)
                }, false)

                chrome.runtime.onConnect.addListener((port) => {
                    console.log(port);

                    if (port.name === 'test') {
                        port.onMessage.addListener((data) => {
                            console.log('Received from popup:', data.message)
                            if (data.message === 'WHO') {
                                port.postMessage({message: 'I am content.js'})
                            }
                        })
                    }
                })

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

