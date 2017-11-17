//更改夜间主题
mui.plusReady(function() {
		
		var theme = plus.storage.getItem("theme");
		//若为夜间模式，则更改为夜间样式
		if(theme=="dark"){
			$('#dark').addClass('mui-active');
//			$("link[title='default']").attr("disabled","disabled");
//			$("link[title='dark']").removeAttr("disabled"); 
		}

		mui('.mui-content .mui-switch').each(function() { //循环所有toggle
		//toggle.classList.contains('mui-active') 可识别该toggle的开关状态
//	    this.parentNode.querySelector('span').innerText = '状态：' + (this.classList.contains('mui-active') ? 'true' : 'false');
		/**
		 * toggle 事件监听 
		 */
		var currentColor = null;
		
		this.addEventListener('toggle', function(event) {
			//event.detail.isActive 可直接获取当前状态
//			this.parentNode.querySelector('span').innerText = '状态：' + (event.detail.isActive ? 'true' : 'false');
			theme = plus.storage.getItem("theme");
			plus.storage.setItem("currentTheme", theme);//保存切换夜间主题之前得主题
			if(event.detail.isActive){
				
				$("link[title='default']").attr("disabled","disabled");
				$("link[title='dark']").removeAttr("disabled"); 
				currentColor = document.getElementsByClassName('detail-nav')[0].style.backgroundColor;
				if(currentColor == null || currentColor == ""){
					currentColor = 'rgb(27,130,210)'
				}
//				alert(currentColor)

				plus.storage.setItem("theme", "dark");//主题保存到本地
				
//				$('.detail-nav').css('background-color','rgb(33,33,33)');
//				$('.mui-content').css('background-color','rgb(48,48,48)');
//				$('.MD5-content').css('background-color','rgb(68,68,68)');
//				$('.mui-table-view-cell').css('background-color','rgb(68,68,68)');
//				$('.mui-table-view-cell').css('color','rgb(255,255,255)');
//				$('.pp').css('color','rgb(255,255,255)'); 
				mui.toast("夜间模式应用成功");
			}else{
				
				plus.storage.setItem("theme", "default");
				$("link[title='dark']").attr("disabled","disabled");
				$("link[title='default']").removeAttr("disabled"); 
//				$('.detail-nav').css('background-color',currentColor);
//				$('.mui-content').css('background-color','rgb(239,239,244)'); 
//				$('.MD5-content').css('background-color','rgb(255,255,255)');
//				$('.mui-table-view-cell').css('background-color','rgb(255,255,255)');
//				$('.mui-table-view-cell').css('color','rgb(0,0,0)');
//				$('.pp').css('color',currentColor); 
			}

		});
	});
	
	
	document.getElementById('theme').addEventListener('tap', function() {
		var newWV = plus.webview.create('themeSelect.html', 'new');
		newWV.show('slide-in-right', 200);

	});

	

})

