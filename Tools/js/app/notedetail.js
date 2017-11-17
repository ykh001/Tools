/**
 * 便签查看js
 */
// 显示区高度
$('.note-detail-view').css('height', (document.documentElement.clientHeight-45)+'px');

// 自定义监听事件
window.addEventListener("noteEvent", function(event) {
	// 便签id号
	var _noteId = event.detail.noteid;
	var _dateInfo = new Date(parseInt(_noteId.substring(4)));
	// 创建日期
	var _createDate = _dateInfo.toLocaleDateString();
	// 创建时间
	var _createTime = _dateInfo.toLocaleTimeString();
	var _timeArr = _createTime.split(':');
	var _ma = _timeArr[0].substring(0, 2);
	var _hour = parseInt(_timeArr[0].substring(2));
	if (_ma == '下午' && _hour < 12) {
		_hour = _hour + 12;
	}
	
	// 如果是个位数，则在左边补零
	if (_hour < 10) {
		_hour = '0' + _hour;
	}
	
	// 显示便签内容
	$('.note-detail-view').text(localStorage.getItem(_noteId));
	
	// 便签创建日期
	$('.show-createtime').html('创建时间: '+_createDate+"&nbsp;&nbsp;"+_hour+':'+_timeArr[1]+':'+_timeArr[2]);
});