/**
 * 滚动到一定距离，顶部城市显示区域颜色改变
 */
//$(window).scroll(function() {
//	if ($(window).scrollTop() > 10) {
//		$('.index-nav').css('backgroundColor', '#FFFFFF');
//	} else {
//		$('.index-nav').css('backgroundColor', 'rgba(27,130,210,255)');
//	}
//});

mui.plusReady(function() {
	document.getElementsByClassName('city-item')[0].addEventListener('tap', function() {
		var newWV = plus.webview.create('html/audio.html', 'new');
		newWV.show('slide-in-left', 300);

	});
	document.getElementsByClassName('city-item')[1].addEventListener('tap', function() {
		var newWV = plus.webview.create('html/bdPicture-class.html', 'new');
		newWV.show('slide-in-right', 300);

	});
	document.getElementsByClassName('city-item')[2].addEventListener('tap', function() {
		var newWV = plus.webview.create('html/uploader.html', 'new');
		newWV.show('slide-in-right', 300);

	});
	//打开设置
//	document.getElementsByClassName('shezhi')[0].addEventListener('tap', function() {
//
//		plus.webview.open("html/setting.html");
//
//	});
});


