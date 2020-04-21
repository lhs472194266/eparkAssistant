let haisen = {
    dict: {
        popup: "popup",
        background: "background",
        content: "content",
    }
};

haisen.response = {
    success: {code: 0, message: "success"},
    successData: function (data) {
        if (data === null || data === undefined) {
            data = [];
        }
        return {code: 0, message: "success", data: data};
    },
    error: function (msg) {
        if (msg === null || msg === undefined) {
            msg = "fail";
        }
        return {code: 1, message: msg};
    }
};

haisen.utils = {

    getCurrentTabId_delete: function (callback) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            if (callback)
                callback(tabs.length ? tabs[0].id : null);
        });
    },
    copy: function (obj, fn) {
        if (typeof obj !== 'object') return obj;
        let newObj = {};
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                newObj[prop] = obj[prop];
            }
        }

        if (fn !== null && fn !== undefined) {
            newObj.run = fn;
        }

        return newObj;
    }
};

haisen.message = {
    app_open_options: {from: haisen.dict.popup, type: "app.open", what: "options"},
    bg_data_webRequest_queryTicket_listV2: {from: haisen.dict.content, type: "bg.data", what: "queryTicket_listV2"},
    /**
     * 抓取当前页面 ticket 最后一次回复
     */
    app_crawl_lastReply: {from: haisen.dict.popup, type: "app.crawl", what: "lastReply", title: "批量抓取最后一次回复"}
};
