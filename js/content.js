var content = content || {
	currentProjectName : null,
	windowLocation : window.location
};

$(function() {
	if(content.checkPathnameIsLoginURL()){
		content.connectionToBgPage();
		content.loginAssintant('checklogin.do');
		content.bindListener();
	}
});

content.connectionToBgPage = function(){
/*	chrome.extension.sendRequest({
		action : "contentObject",
		accountObject : account,
	}, function(data) {
		if(data.success == true){
			console.log(data.message);
		}else{
			console.log("content 页面往background 页面同步account 对象失败了.");
		}
	});*/
}

/**
 * 绑定监听
 */
content.bindListener = function(){
	// 1. 监听 background
	chrome.extension.onRequest.addListener(function(request, sender, callback) {
	   console.log(request);
	   sendResponse({success: true});
	});
}

/**
 * 打开登陆页面时，自动登陆
 */
content.loginAssintant = function(url) {
	var noProject = "noProject";
	switch (window.location.href) {
		case account.absolutePath.teyiting + "login.jsp":
			content.loginPost(url, account.accountID.teyiting , "/index.do") == true ? (content.currentProjectName = account.projectName.teyiting) : noProject;
			break;
		case account.absolutePath.taizhou + "login.jsp":
			content.loginPost(url, account.accountID.taizhou, "/index.do") == true ? (content.currentProjectName = account.projectName.taizhou) : noProject;
			break;
		case account.absolutePath.rizhao + "login.jsp":
			content.loginPost(url, account.accountID.rizhao, "/index.do") == true ? (content.currentProjectName = account.projectName.rizhao) : noProject;
			break;
		case account.absolutePath.changshu + "login.jsp":
			content.loginPost(url, account.accountID.changshu, "/index.do") == true ? (content.currentProjectName = account.projectName.changshu) : noProject;
			break;
		case account.absolutePath.zhengzhou + "login.jsp":
			content.loginPost(url, account.accountID.zhengzhou, "/index.do") == true ? (content.currentProjectName = account.projectName.zhengzhou) : noProject;
			break;
		case account.absolutePath.test + "login.jsp":
			content.loginPost(url, account.accountID.test, "/index.do") == true ? (content.currentProjectName = account.projectName.test) : noProject;
			break;
		case account.absolutePath.local + "login.jsp":
			content.loginPost(url, account.accountID.local, "/epark/index.do") == true ? (content.currentProjectName = account.projectName.local) : noProject;
			break;
		default:
			console.log("content.loginAssintant default!");
			break;
	}
}

/**
 * 发送登陆
 */
content.loginPost = function(url, data, index) {
	var result = 1;
	for (var j = 0; j < data.usrPwd.length; j++) {
		$.ajax({
			url : url,
			type : "POST",
			async : false,
			data : {
				usrName:data.usrName,
				usrPwd :data.usrPwd[j],
				captcha:"0"
			},
			success : function(res) {
				if (res.resultInfo == 1) {
					result = 0;
					window.location.href = window.location.origin + index;
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

content.checkPathnameIsLoginURL = function(){
	var flag = false;
	var arr = ["/login.jsp","/epark/login.jsp"];
	for (var i = 0; i < arr.length; i++) {
		if(window.location.pathname == arr[i]){
			flag = true;
		}
	}
	return flag;
}
