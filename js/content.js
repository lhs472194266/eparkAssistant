var content = content || {};

$(function() {
	if(window.location.pathname == "/login.jsp"){
		content.connectionToBgPage();	// 这个暂且也只允许去握手一次
		content.loginAssintant('checklogin.do', 'login.jsp');
	}
});

/**
 * 打通任督二脉，第一次握手.
 */
content.connectionToBgPage = function(){
	chrome.extension.sendRequest({
		action : "contentObject",
		accountObject : account,
	}, function(data) {
		console.log(data);
	});
}

/**
 * 打开登陆页面时，自动登陆
 */
content.loginAssintant = function(url, loginPage) {
	var projectName = "", noProject = "noProject";
	switch (window.location.href) {
		case account.absolutePath.teyiting + loginPage:
			content.loginPost(url, account.accountID.teyiting) == true ? (projectName = account.projectName.teyiting) : noProject;
			break;
		case account.absolutePath.taizhou + loginPage:
			content.loginPost(url, account.accountID.taizhou) == true ? (projectName = account.projectName.taizhou) : noProject;
			break;
		case account.absolutePath.rizhao + loginPage:
			content.loginPost(url, account.accountID.rizhao) == true ? (projectName = account.projectName.rizhao) : noProject;
			break;
		case account.absolutePath.changshu + loginPage:
			content.loginPost(url, account.accountID.changshu) == true ? (projectName = account.projectName.changshu) : noProject;
			break;
		case account.absolutePath.zhengzhou + loginPage:
			content.loginPost(url, account.accountID.zhengzhou) == true ? (projectName = account.projectName.zhengzhou) : noProject;
			break;
	}
	chrome.extension.sendRequest({
		action : account.contentSendRequest.switchProjectOnBrowserAction,
		projectName : projectName,
	}, function(data) {
		console.log(data);
	});
}

content.loginPost = function(url, data) {
	var result = 1;
	for (var j = 0; j < data.usrPwd.length; j++) {
		$.ajax({
			url : url,
			type : "POST",
			async : false,
			data : {
				usrName:data.usrName,
				usrPwd :data.usrPwd[j],
				captcha:data.captcha
			},
			success : function(res) {
				if (res.resultInfo == 1) {
					result = 0;
					window.location.href = window.location.origin + "/index.do";
				} else {
					result = 1;
					console.log("登录失败！, " + data.usrPwd[j]);
				}
			}
		})
		if(result == 0){
			break;
		}
	}

	if (result == 0) {
		return true;
	} else {
		return false;
	}
}
