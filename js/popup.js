var popup = popup || {
	account : account,
	background : chrome.extension.getBackgroundPage(),
	dataFromBgPage : null,
	currentProject : "noProject"
};

$(function() {
	popup.getDataFrombgPage();
	popup.bindEvent();
	popup.bindListener();
});

popup.bindEvent = function() {
	$(".project_name").hover(function(){
		$(".project_name").blur();
		popup.switchProject(popup.currentProject);
	});
	
	$("#project_list li").click(function(){
		$(".project_name").text($(this).text());
	});
	
	$.each($("li", "#main"), function(index, element) {
		$(element).hover(function() {
			$("li", "#main").css("backgroundColor","#fff");
			$(this).css({"backgroundColor":"#ccc"});
		});
	});
}

popup.bindListener = function() {
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		switch (request.action) {
			case "":
				break;
		}
	});
}

/**
 * 查询当前Tab页打开的是什么项目，并初始化 <select> 元素.
 */
popup.getDataFrombgPage = function(){
	var currentProjectName = "noProject";  
	chrome.tabs.getSelected(null, function(tab) {
		for ( var key in popup.account.absolutePath) {
			var reg = new RegExp("^" + popup.account.absolutePath[key], "i");
			if(reg.test(tab.url)){
				currentProjectName = key;
			}
		}
		popup.ininElement(currentProjectName);
	});
	return currentProjectName;
}

popup.ininElement = function(currentProjectName){
	var innerHtml = "",$projectNameDom = $("#project_name"),
		projectNameArr = popup.account.projectName.projectNameArr,
		projectNameZhArr = popup.account.projectName.projectNameZhArr;
	
	for (var i = 0; i < projectNameArr.length; i++) {
		if(currentProjectName == projectNameArr[i]){
			innerHtml += "<option value=" + projectNameArr[i] + " selected='selected' >" + projectNameZhArr[i] + "</option>"
			popup.currentProject = projectNameArr[i];
		}else{
			innerHtml += "<option value=" + projectNameArr[i] + ">" + projectNameZhArr[i] + "</option>"
		}
	}
	$projectNameDom.append(innerHtml);
}

popup.switchProject = function(currentProject){
	if($("#project_name").val() != currentProject){
		popup.currentProject = $("#project_name").val();
		chrome.extension.sendRequest({
			action  : "switchProject_popup",
			projectName: popup.currentProject
		}, function(response) {
			  if(response.success){
				  console.log(response.message);
			  }
		});
	}
}
