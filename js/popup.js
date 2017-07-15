var popup = popup || {
	globalData:content,
	bgPageWindow:chrome.extension.getBackgroundPage(),
	dataFromBgPage:null
};

$(function() {
	popup.getDataFrombgPage();
	popup.ininElement();
	popup.bindEvent();
});

/**
 * 		    <option value="noProject">未打开</option>
		    <option value="teyiting">特易停</option>
		    <option value="taizhou">泰州</option>
		    <option value="changshu">常熟</option>    
		    <option value="rizhao">日照</option>    
		    <option value="zhengzhou">郑州</option>    
		    <option value="test">测试</option>    
		    <option value="local">本地</option>   
 */
popup.ininElement = function(){
	var content = "",$projectNameDom = $("#project_name"),
		projectNameArr = popup.globalData.projectName.projectNameArr,
		projectNameZhArr = popup.globalData.projectName.projectNameZhArr;
	
	for (var i = 0; i < projectNameArr.length; i++) {
		if(popup.dataFromBgPage.currentTabProjectName == projectNameArr[i]){
			content += "<option value=" + projectNameArr[i] + " selected='selected' >" + projectNameZhArr[i] + "</option>"
		}else{
			content += "<option value=" + projectNameArr[i] + ">" + projectNameZhArr[i] + "</option>"
		}
	}
	$projectNameDom.append(content);
}

popup.bindEvent = function() {
	
	$(".project_name").hover(function(){
		$(".project_name").blur();
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

/**
 * 后台对象永不变，主动去询问现在是什么项目
 */
popup.getDataFrombgPage = function(){
	popup.dataFromBgPage = popup.bgPageWindow.bgPage.sendAllDataToViewPage();
	console.log("主动去询问现在是什么项目:");
	console.log(popup.dataFromBgPage);
}
