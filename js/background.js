var bgPage = bgPage || {
	//viewPage : chrome.extension.getViews(),
	account:null/*{
		currentTabProjectName:"noProject"
	}*/
};

$(function() {
	bgPage.bindListener();
	bgPage.consoleNormall();
});

bgPage.bindListener = function() {
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		console.log( bgPage.account.contentSendRequest);
		switch (request.action) {
			case "contentObject":
				bgPage.account = request.accountObject;	// 是同一个对象吗？？猜想是.
				console.log(request.accountObject);
				break;
			case bgPage.account.contentSendRequest.switchProjectOnBrowserAction:
				bgPage.bgPageData.currentTabProjectName = request.projectName;
				console.log("background 监听收到小心,当前页面属于 " + request.projectName + "项目。");
				break;
		}
	});
}

bgPage.sendAllDataToViewPage = function(){
	bgPage.consultCurrentProjectFromContentPage();
	return bgPage.bgPageData;
}

bgPage.consoleNormall = function(){
	console.log('%cbackground   normal!', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;');
	console.log("%c", "margin-left: 316px;padding:100px 0px 50px 200px;line-height:50px;background:url('http://i2.s1.dpfile.com/pc/gp/eac9b51a169a02cbcacb067a4bcc045b(600x300)/thumb.jpg') no-repeat;");
}

bgPage.consultCurrentProjectFromContentPage = function(){
	console.log(bgPage.account);
}