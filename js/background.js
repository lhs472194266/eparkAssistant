var bgPage = bgPage || {
	account : account
};

$(function() {
	bgPage.bindListener();
	bgPage.consoleNormall();
});

bgPage.bindListener = function() {
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		switch (request.action) {
			case "contentObject":
				bgPage.account = request.accountObject;
				sendResponse({
					success: true,
					message: "background response: 收到centent 页面同步过来的account对象."  
				});
				break;
			case "switchProject_popup":
				// 读取配置项,是在新tab打开页面，还是当前页面重定向
				bgPage.getCurrentTabData(request.projectName);
				sendResponse({
					success: true,
					message: "background response: 收到popup 页面切换项目."  
				});
				break;
		}
	});
}

bgPage.getCurrentTabData = function(projectName){
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {action: "switchProject_bg","projectName":projectName}, function(response) {
		   console.log(response);
		});
	});
}

/**
 * 需要popup 页面来调用该方法，获取 content 发送给 bg 的 account 对象. 
 */
bgPage.transAccountObjToPopup = function(){
	return bgPage.account;
}

bgPage.consoleNormall = function(){
	//console.log('%cbackground   normal!', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;');
	//console.log("%c", "margin-left: 316px;padding:100px 0px 50px 200px;line-height:50px;background:url('http://i2.s1.dpfile.com/pc/gp/eac9b51a169a02cbcacb067a4bcc045b(600x300)/thumb.jpg') no-repeat;");
}
