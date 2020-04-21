$(function () {
    let util = {},
        cache = {
            tabs: {},
            currentTabId: undefined,
            bgObj: chrome.extension.getBackgroundPage(),
            $option_btn: $("#options"),
            $query_last_reply_btn: $("#query_last_reply_btn"),
            $tip: $("#tip"),
            _handlers: [
                /*new function () {
                    return {
                        from: "background",
                        type: "app.crawl",
                        what: "lastReply",
                        run: function (message, rawSender, sendResponse) {
                            sendResponse({code: 0, message: "success"});
                        }
                    }
                }*/
            ],
        },
        memory = {},
        _ = {
            init: function () {
                this.registerPageEvent();
                this.registerListener();
                this.memoryInit();
            },
            registerPageEvent: function () {
                $(".main-header a.logo").css("pointer-events", "none");
                cache.$option_btn.click(() => {
                    module.popup.services.sendBackground(haisen.message.app_open_options, (result) => {
                        console.log(result);
                    });
                });

                cache.$query_last_reply_btn.click(() => {
                    module.popup.services.sendContent(haisen.message.app_crawl_lastReply, (result) => {
                        console.log(result);
                    });
                });
            },
            registerListener: function () {
                chrome.runtime.onMessage.addListener((message, rawSender, sendResponse) => {
                    console.log(`Popup 收到来自 ${message.from} 的消息：${JSON.stringify(message)}`);
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
                // Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.
            }
        },
        module = {
            popup: {
                cache: {},
                init: function () {
                },
                services: {
                    sendContent: function (message, callback) {
                        module.popup._private.addFrom(message);
                        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                            chrome.tabs.sendMessage(tabs.length ? tabs[0].id : null, message, function (response) {
                                if (callback)
                                    callback(tabs.length ? tabs[0].id : null);
                            });
                        });
                    },
                    sendBackground: function (message, callback) {
                        module.popup._private.addFrom(message);
                        chrome.runtime.sendMessage(message, callback);
                    }
                },
                _private: {
                    addFrom: function (message) {
                        message.from = haisen.dict.popup;
                    }
                }
            }
        };

    _.init();
});


/*let popup = popup || {
    account: account,
    background: chrome.extension.getBackgroundPage(),
    dataFromBgPage: null,
    currentProject: "noProject"
};

$(function () {
    popup.getDataFrombgPage();
    popup.bindEvent();
    popup.bindListener();
});

popup.bindEvent = function () {
    $(".project_name").hover(function () {
        $(".project_name").blur();
        popup.switchProject(popup.currentProject);
    });

    $("#project_list li").click(function () {
        $(".project_name").text($(this).text());
    });

    $.each($("li", "#main"), function (index, element) {
        $(element).hover(function () {
            $("li", "#main").css("backgroundColor", "#fff");
            $(this).css({"backgroundColor": "#ccc"});
        });
    });
}

popup.bindListener = function () {
    chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
        switch (request.action) {
            case "":
                break;
        }
    });
}

/!**
 * 查询当前Tab页打开的是什么项目，并初始化 <select> 元素.
 *!/
popup.getDataFrombgPage = function () {
    let currentProjectName = "noProject";
    chrome.tabs.getSelected(null, function (tab) {
        for (let key in popup.account.absolutePath) {
            let reg = new RegExp("^" + popup.account.absolutePath[key], "i");
            if (reg.test(tab.url)) {
                currentProjectName = key;
            }
        }
        popup.ininElement(currentProjectName);
    });
    return currentProjectName;
}

popup.ininElement = function (currentProjectName) {
    let innerHtml = "", $projectNameDom = $("#project_name"),
        projectNameArr = popup.account.projectName.projectNameArr,
        projectNameZhArr = popup.account.projectName.projectNameZhArr;

    for (let i = 0; i < projectNameArr.length; i++) {
        if (currentProjectName == projectNameArr[i]) {
            innerHtml += "<option value=" + projectNameArr[i] + " selected='selected' >" + projectNameZhArr[i] + "</option>"
            popup.currentProject = projectNameArr[i];
        } else {
            innerHtml += "<option value=" + projectNameArr[i] + ">" + projectNameZhArr[i] + "</option>"
        }
    }
    $projectNameDom.append(innerHtml);
}

popup.switchProject = function (currentProject) {
    if ($("#project_name").val() != currentProject) {
        popup.currentProject = $("#project_name").val();
        chrome.extension.sendRequest({
            action: "switchProject_popup",
            projectName: popup.currentProject
        }, function (response) {
            if (response.success) {
                console.log(response.message);
            }
        });
    }
}*/
