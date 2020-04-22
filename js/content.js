$(function () {
    let util = {},
        cache = {
            _handlers: [
                haisen.utils.copy(haisen.message.app_crawl_lastReply, function (message, rawSender, sendResponse) {
                    module.content.services.sendBackground(haisen.message.bg_data_webRequest_queryTicket_listV2, (cacheRequest) => {
                        console.log(`请求：${haisen.dict.background}，获取对应tabId的请求参数，result = ${JSON.stringify(cacheRequest, undefined, 4)}`);

                        if (cacheRequest != null && cacheRequest.code !== 0) {
                            console.log(`bg_data_webRequest_queryTicket_listV2 请求：${haisen.dict.background}，返回异常，result = ${JSON.stringify(cacheRequest, undefined, 4)}`)
                            return;
                        }

                        // todo 封装一下，callback

                        let formData = {};
                        if (cacheRequest.data.method === "POST") {
                            formData = cacheRequest.data.requestBody.formData;
                        }

                        /*chrome.notifications.create("basic", "213", (notificationId) => {

                        });*/

                        $.post(cacheRequest.data.url, formData, (postResult) => {
                            console.log("请求原服务接口：" + cacheRequest.data.url + "请求参数：" + cacheRequest.data.requestBody)
                            console.log("请求原服务接口，返回结果" + JSON.stringify(postResult, undefined, 4));

                            if (postResult.success !== true || postResult.totalCount === 0) {
                                console.log("请求原服务接口，返回异常或无数据");
                                return;
                            }

                            // 通知bg 开心的 Tab页面，用于输出.
                            // todo 目前获取新tab 对象元素有点困难呀。
                            // module.content.services.sendBackground(haisen.message.app_open_console, (response) => { });
                            for (let i = 0; i < postResult.totalCount; i++) {
                                const item = postResult.items[i];

                                let url = `${cacheRequest.data.initiator}/tickets-fly/pages/tickets/queryTicket_queryTicketContentAndMergedContent.action?ticketId=${item.t_id}&dir=asc`;

                                console.log(`根据ticketId=${item.t_id}，请求回复往来，url=${url}`);

                                $.get(url, (getResult) => {
                                    if (getResult.success === true && getResult.totalCount > 0) {
                                        console.log(`ticketId=${item.t_id}，最后一次回复信息：${getResult.items.pop(1).body}`);
                                    }
                                }, dataType = "json");
                            }

                        }, dataType = "json");

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

                $("body").append("<div style='display: none;background: red;height: 200px;z-index: 30000;position: absolute;width: 100%;top: 100px;opacity: 0.6;' id='haisen_console'>123</div>");

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

                /* window.addEventListener('message', (e) => {
                     console.log(e.data)
                 }, false)*/

                /*chrome.runtime.onConnect.addListener((port) => {
                    console.log(port);

                    if (port.name === 'test') {
                        port.onMessage.addListener((data) => {
                            console.log('Received from popup:', data.message)
                            if (data.message === 'WHO') {
                                port.postMessage({message: 'I am content.js'})
                            }
                        })
                    }
                })*/
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
                    },
                    // 向指定tab centent 发送消息
                    sendContent: function (message, callback) {
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