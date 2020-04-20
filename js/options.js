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
                cache.option_btn.click(() => {

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