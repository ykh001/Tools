/**
 * 便签js
 */
// 根据移动端屏幕的高度设置内容显示区的高度
$('.note-item-wrapper').css('height', (document.documentElement.clientHeight-94)+'px');

// 显示我的便签
showMyShortNote();

// 便签事件绑定
bindNoteItemTap();

// 更新已选项数量
updateDelCount();

mui.plusReady(function() {
	// 便签长按事件监听
	addLongTapDelListener();
	
	/**
	 * 监听删除按钮事件
	 */
	document.getElementById('delBtn').addEventListener('tap', function() {
		// 删除按钮内容，判断当前是否有已选择的便签
		var _contentStr = this.innerText;
		// 已选择的便签
		var _notes = $('.select-flag-selected');
		// 已选择要删除的便签
		if (_contentStr.length > 2) {
			// 选择删除的数量
			var _chooseNum = _contentStr.substring(3, _contentStr.length-1);
			// 点击删除按钮触发
		    if (mui.os.plus) { 
		        var btn = [{ title:'确定' }, { title:'取消' }]; 
		        plus.nativeUI.actionSheet({ 
		        	title: '确定要删除这'+_chooseNum+'条便签吗？',
		            buttons: btn 
		        }, function(b) {    // 回调事件
		            switch (b.index) { 
		            	// 确认删除便签
		                case 1: 
		                	// 从页面中删除便签
		                	var _selectShortNotes = $('.select-flag-selected');
		                	for (var i = 0, len = _selectShortNotes.length; i < len; i++) {
		                		$(_selectShortNotes[i]).parent().parent().remove();
		                	}
							
		                	// 已选择的所有便签的id数组
		                	for (var i = 0, len = _selectShortNotes.length; i < len; i++) {
		                		// 从localStorage中删除所选便签
		                		localStorage.removeItem(_selectShortNotes[i].dataset.id);
		                	}
		                	
							mui.toast('已删除所选便签');
							// 还原状态
							cancle();
							// 更新已选择项数目
							updateDelCount();
							// 显示我的便签
							showMyShortNote();
		                    break; 
		                
		                // 取消
		                case 2:
		                	break; 
		                default: 
		                    break; 
		            } 
		        }); 
		    } 
		}
	});
	
	/**
	 * 添加便签或取消已选
	 */
	document.querySelector('.add-note').addEventListener('tap', function() {
		if (this.innerText == '取消') {
			cancle();
		} else {
			mui.openWindow({
				url:"editnote.html",
				id:"editnote.html"
			});
		}
	});
	
	// 点击某个便签
	bindNoteItemTap();
	
	// 编辑或全选
	document.querySelector('.edit-note').addEventListener('tap', function() {
		if ($('.note-item').length) {
			var _$this = $(this);
			var _type = _$this.text();
			var _notes = document.querySelectorAll('.note-item');
			for (var j = 0, len = _notes.length; j < len; j++) {
				var _noteItem = $(_notes[j]);
				if (_type == '全选') {
					var _wrapper = _noteItem.find('.note-check');
					_wrapper.children('input').addClass('change-bgcolor');
					_wrapper.children('span').removeClass('select-flag').addClass('select-flag-selected');
				} else {
					_$this.text('全选');
					$('.add-note').text('取消').css('fontSize', '18px');
					_noteItem.find('.checkbox').removeClass('checkbox').removeClass('change-bgcolor').addClass('checkbox-selected');
					_noteItem.find('.note-content-preview').removeClass('note-content-preview').addClass('note-content-toggle');
				}
			}
			// 调整屏幕可视区高度
			$('.note-item-wrapper').css('height', (document.documentElement.clientHeight-142)+'px');
			// 底部显示删除按钮
			$('.bottom-div').removeClass('del-div').addClass('del-div-toggle');
			// 更新已选项数量
			updateDelCount();
		} else {
			mui.toast('当前无便签可编辑！');
		}
	});

});


/**
 * 便签长按删除事件监听
 */
function addLongTapDelListener() {
	// 所有便签
	var _notes = document.querySelectorAll('.note-item');
	for (var i = 0, len = _notes.length; i < len; i++) {
		var _curNote = $(this);
		// 在每次监听前先移除该事件监听，防止事件产生累加
		_notes[i].removeEventListener('longtap', delSingleNote, false);
		// 监听长按事件
		_notes[i].addEventListener('longtap', delSingleNote, false);
	}
}

/**
 * 删除单个便签操作
 */
function delSingleNote() {
	var _$curNote = $(this);
	var _noteId = _$curNote.children('span').children('span').data('id');
	var _noteContent = localStorage.getItem(_noteId);
	// 便签内容预览
	var _notePreview;
	// 超过8个字符，显示省略号
	if (_noteContent.length > 8) {
		_notePreview = _noteContent.substring(0, 9)+'...';
	} else {
		_notePreview = _noteContent;
	}
	// 长按便签触发
	if (mui.os.plus) { 
        var btn = [{ title:'确定' }, { title:'取消' }]; 
        plus.nativeUI.actionSheet({ 
        	title: '确定要删除便签 ['+_notePreview+'] 吗？',
            buttons: btn 
        }, function(b) {    // 回调事件
            switch (b.index) { 
            	// 确认删除便签
                case 1: 
                	// 从页面中删除便签
                	_$curNote.remove();
                	// 从localStorage中删除便签
                	localStorage.removeItem(_noteId);
					mui.toast('便签已删除');
                    break; 
                
                // 取消
                case 2:
                	break;
                default: 
                    break; 
            } 
        }); 
    }
}

/**
 * 自定义事件监听
 */
document.addEventListener('updateNoteShow', showMyShortNote);


/**
 * 便签点击事件绑定
 */
function bindNoteItemTap() {
	// 单选某个便签
	var _notes = document.querySelectorAll('.note-item');
	for (var i = 0, len = _notes.length; i < len; i++) {
		_notes[i].addEventListener('tap', function() {
			var _flag= document.querySelector('.edit-note').innerText;
			if (_flag == '全选') {
				var _wrapper = $(this).find('.note-check');
				// 在选择的便签前面打勾
				var _span = _wrapper.children('span');
				_wrapper.children('input').toggleClass('change-bgcolor');
				_span.toggleClass('select-flag-selected');
				if (_span.hasClass('select-flag-selected')) {
					_span.removeClass('select-flag');
				} else {
					_span.addClass('select-flag');
				}
			} else {
				// 查看便签详情
				mui.openWindow({
					url:"notedetail.html",
					id:"notedetail.html"
				});
				
				// 触发自定noteEvent函数
				mui.fire(plus.webview.getWebviewById("notedetail.html"), 'noteEvent', 
					{ noteid: $(this).children('span').children('span').data('id') });
			}
			// 更新已选项数量
			updateDelCount();
		});
	}
}

/**
 * 取消
 */
function cancle() {
	$('.edit-note').text('编辑');
    $('.add-note').text('+').css('fontSize', '30px');
    var _notes = document.querySelectorAll('.note-item');
	for (var i = 0, len = _notes.length; i < len; i++) {
		var _noteItem = $(_notes[i]);
		var _wrapper = _noteItem.find('.note-check');
		_wrapper.children('input').removeClass('checkbox-selected').addClass('checkbox');
		_wrapper.children('span').removeClass('select-flag-selected').addClass('select-flag');
		_noteItem.find('.note-content-toggle').removeClass('note-content-toggle').addClass('note-content-preview');
	}
	// 调整屏幕可视区高度
	$('.note-item-wrapper').css('height', (document.documentElement.clientHeight-92)+'px');
	// 隐藏底部删除按钮
	$('.bottom-div').removeClass('del-div-toggle').addClass('del-div');
}


/**
 * 从localStorage中读取便签并显示
 */
function showMyShortNote() {
	/*<div class="note-item">
		<!-- 选择框 -->
		<span class="note-check">
			<input type="checkbox" class="checkbox" />
			<span class="select-flag">√</span>
		</span>
		
		<!-- 便签内容预览 -->
		<span class="note-content-preview">
			这里是便签内容显示区域你可以编辑便签，可以随时查看
		</span>
	
		<!-- 便签添加时间 -->
		<span class="note-add-time">
			17/05/28
		</span>
		
		<!-- 查看详情箭头 -->
		<span class="mui-icon mui-icon-arrowright note-right-arrow"></span>
	</div>*/
	
	// 是否存在便签
	var _isExistNote = false;
	// 外层div
	var _outerWrapper = $('.note-item-wrapper');
	// 每次显示前，清空原有内容
	_outerWrapper.html('');
	
	// 便签编号id数组
	var _noteIdArr = [];
	
	for (var i =0 , len = localStorage.length; i < len; i++) {
		var _key = localStorage.key(i);
		// 便签编号以note开头
		if (_key.indexOf('note') != -1) {
			// 存在便签
			_isExistNote = true;
			// 存储便签id
			_noteIdArr.push(parseInt(_key.substring(4)));
		}
	}
	
	// 还没有任何便签
	if (!_isExistNote) {
		_outerWrapper.append($('<span></span>').text('您还没有便签，点击右上方加号添加便签！')
			.css({
				color: 'rgba(0, 0, 0, 0.6)',
				display: 'inline-block',
				marginTop: '20px'
			}));
	} else {
		// 对便签按时间进行降序排序（最新的在最前面）
		_noteIdArr.sort(function(a, b) {
			return b - a;
		});
		
		for (var i = 0, len = _noteIdArr.length; i < len; i++) {
			// 便签创建时间
			var _createTime = new Date(_noteIdArr[i]).toLocaleDateString().substring(2);
			// 便签内容
			var _noteContent = localStorage.getItem('note'+_noteIdArr[i]);
			
			// 创建便签div
			var _noteItem = $('<div></div>').addClass('note-item');
			
			// 选择框
			var _chooseSpan = $('<span></span>').addClass('note-check')
							  .append($('<input />').attr('type', 'checkbox').addClass('checkbox'))
							  .append($('<span></span>').addClass('select-flag').text('√').attr('data-id', 'note'+_noteIdArr[i]));
			
			// 便签内容预览
			var _contentSpan = $('<span></span>').addClass('note-content-preview').text(_noteContent);
			
			// 便签创建时间
			var _dateSpan = $('<span></span>').addClass('note-add-time').text(_createTime);
			
			// 向右边的箭头
			var _rightArrow = $('<span></span>').addClass('mui-icon mui-icon-arrowright note-right-arrow');
			
			_noteItem.append(_chooseSpan).append(_contentSpan).append(_dateSpan).append(_rightArrow);
			_outerWrapper.append(_noteItem);
		}
	}
	
	// 对每个便签进行点击事件绑定
	bindNoteItemTap();
	
	// 便签长按事件监听
	addLongTapDelListener();
}

/**
 * 监听选择并更新显示已选择项
 */
function updateDelCount() {
	var _btn = $('#delBtn');
	var _count = $('.select-flag-selected').length;
	if (_count > 0) {
		_btn.css('color', '#000000').text('删除('+_count+')');
	} else {
		_btn.css('color', 'rgba(0, 0, 0, 0.4)').text('删除');
	}
}