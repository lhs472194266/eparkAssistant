$(function () {
    let util = {},
        cache = {
            $option_btn: $("#options"),
            $query_last_reply_btn: $("#query_last_reply_btn"),
        },
        memory = {},
        _ = {
            init: function () {
                this.registerPageEvent();
                this.memoryInit();
            },
            registerPageEvent: function () {
                $(".main-header a.logo").css("pointer-events", "none");
                cache.$option_btn.click(() => {
                    chrome.runtime.sendMessage({
                        type: "app.open",
                        what: "options"
                    }, function (result) {
                        console.log(result);
                    });
                });

                cache.$query_last_reply_btn.click(() => {
                    chrome.runtime.sendMessage({
                        type: "app.crawl",
                        what: "lastReply",
                        title: "批量抓取最后一次回复"
                    }, function (result) {
                        console.log(result);
                    });
                });
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
