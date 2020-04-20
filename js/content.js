$(function () {
    let util = {},
        cache = {},
        memory = {},
        _ = {
            init: function () {
                this.registerPageEvent();
                this.memoryInit();
            },
            registerPageEvent: function () {
                // 接收来自后台的消息
                chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                    console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
                    sendResponse('我收到你的消息了：' + JSON.stringify(request));

                });
                /*                chrome.runtime.onMessage.addListener((message, rawSender, sendResponse) => {
                                    switch (message.type) {
                                        case "app.crawl":
                                            switch (message.what) {
                                                case "lastReply":
                                                    console.log(message.title);
                                                    break;
                                            }
                                            break;
                                    }
                                    sendResponse('我已收到你的消息：' + JSON.stringify(message));
                                });*/
            },
            memoryInit: function () {

            }
        },
        module = {
            popup: {
                cache: {},
                init: function () {
                },
                services: {},
                chartUseRatio: function (data) {
                }
            }
        };

    _.init();
});