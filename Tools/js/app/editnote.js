/**
 * 便签添加js
 */
mui.plusReady(function() {
	// 根据设备自动设置编辑区高度
	$('.note-edit-wrapper').css('height', (document.documentElement.clientHeight-73)+'px');
	
	// 自动文本提示
	var inputArea = document.querySelector('.note-edit-area');
	
	inputArea.onfocus = function() {
		if(this.value.replace(/(^\s*)|(\s*$)/g, '') == '请在此输入您想记录的内容...') {
			this.value = '';
		}
	};

	inputArea.onblur = function() {
		if(!this.value.replace(/(^\s*)|(\s*$)/g, '').length) {
			this.value = '请在此输入您想记录的内容...';
		}
	};
	
	/**
	 * 取消事件监听
	 */
	document.getElementsByClassName('cancle-edit')[0].addEventListener('tap', backNoteIndex);
	
	/**
	 * 完成
	 */
	document.querySelector('.save-note').addEventListener('click', function() {
		var _noteContent = document.querySelector('.note-edit-area').value.replace(/(^\s*)|(\s*$)/g, '');
		if (_noteContent == '请在此输入您想记录的内容...') {
			mui.toast('请输入便签内容！');
			// 字符输入提示重置
		    $('.cur-word-num').text('0'); 
		    $('.remain-word-num').text('300');
		} else if(_noteContent.length == 0) {
			mui.toast('请输入便签内容！');
			document.querySelector('.note-edit-area').value = '请在此输入您想记录的内容...';
			// 字符输入提示重置
		    $('.cur-word-num').text('0'); 
		    $('.remain-word-num').text('300');
		} else {
			/**
			 * 将便签存储到本地localStorage中
			 */
			localStorage.setItem('note'+new Date().getTime(), _noteContent);
			
//			mui.toast(_noteContent);
			/*点击删除图标触发*/ 
		    if (mui.os.plus) { 
		        var btn = [{ title:'便签首页' }, { title:'继续添加' }]; 
		        plus.nativeUI.actionSheet({ 
		        	title: "便签添加成功",
		            buttons: btn 
		        }, function(b) {    /*actionSheet 按钮点击回调事件*/ 
		            switch (b.index) { 
		            	// 返回首页
		                case 1: 
							backNoteIndex();
		                    break; 
		                    
		                // 继续添加
		                case 2:
		                default: 
		                    break; 
		            } 
		        }); 
		    } 
		    
		    // 字符输入提示重置
		    $('.cur-word-num').text('0'); 
		    $('.remain-word-num').text('300');
			
			document.querySelector('.note-edit-area').value = '请在此输入您想记录的内容...';
			$('.note-edit-area').css('color', 'rgba(0, 0, 0, 0.5)');
		}
	});
	
	
	/**
	 * 监听文本域内容改变
	 */
	$('.note-edit-area').bind('propertychange input', function () {  
		// 已输入字符个数
        var counter = $(this).val().length;
        // 最大输入字符个数
        var maxNum = 300;
        
        // 字体颜色变更
	    if($(this).val().replace(/(^\s*)|(\s*$)/g, '').length > 0) {
	       	$('.note-edit-area').css('color', '#000000');
	    } else {
	    	$('.note-edit-area').css('color', 'rgba(0, 0, 0, 0.5)');
	    }
        
	    // 限制输入字数
        if (counter <= maxNum) {
        	$('.cur-word-num').text(counter);    
        	// 剩余输入字符个数，每次减去字符长度
        	$('.remain-word-num').text(maxNum - counter);
        } else {
        	mui.toast('输入字符个数超过最大可输入字符个数！');
        	// 达到最大输入字符个数，禁止输入
        	$(this).val($(this).val().substring(0, maxNum));
        }
	});
});

/**
 * 回到便签首页
 */
function backNoteIndex() {
	// 当前窗口
	var _curPage = plus.webview.currentWebview();
	// 打开窗口
	mui.openWindow({
		url:'bianqian.html',
		id:'bianqian.html'
	});
	
	// 触发自定义事件
	mui.fire(plus.webview.getWebviewById('bianqian.html'), 'updateNoteShow', { });

	// 关闭当前窗口
	_curPage.close();
}