//更改夜间主题
mui.plusReady(function() {

	var theme = plus.storage.getItem("theme");
	var currentTheme = plus.storage.getItem("currentTheme");

//	alert(currentTheme)
	if(theme=="dark"){
		$("link[title='default']").attr("disabled","disabled");
		$("link[title='dark']").removeAttr("disabled"); 
	}else if(theme=="default"){
		$("link[title='dark']").attr("disabled","disabled");
		$("link[title='default']").removeAttr("disabled"); 
	}
	
})

