mui.init({
	    keyEventBind: {
	        backbutton: true  // 打开back按键监听
	    },
			// 配置具体需要监听的手势事件
		gestureConfig:{
			longtap: true,  // 手机端长按事件，默认为 false
		}
});
	    
// 移动端back键事件
//mui.back = function () {
//	plus.webview.open("../index.html");
//}

mui.plusReady(function() {
	
/**
 * 滚动到一定距离，顶部城市显示区域颜色改变
 */
	$(window).scroll(function() {
		if ($(window).scrollTop() > 50) {
			
			var div = $('<div></div>').addClass('cur-temperature').append(
							$('<span></span>').addClass('cur-font-color').text('历史上的今天'));
			$('#titleheader').empty();
			$('#titleheader').append(div);
		} else {
			
			$('#titleheader').empty();
		}
	});


	var dDate = new Date();
	$('#pickDateBtn').text(dDate.getFullYear()+'-'+(dDate.getMonth() + 1)+'-'+dDate.getDate());
	searchToday((dDate.getMonth() + 1),dDate.getDate());
	
	document.getElementById("pickDateBtn").addEventListener('tap', function() {
		var dDate = new Date();
		//设置当前日期（不设置默认当前日期）
		dDate.setFullYear(dDate.getFullYear(), dDate.getMonth(), dDate.getDate());
		
		var minDate = new Date();
		//最小时间
		minDate.setFullYear(1990, 0, 1);
		var maxDate = new Date();
		//最大时间
		maxDate.setFullYear(2020, 11, 31);
		
		plus.nativeUI.pickDate(function(e) {
			var d = e.date;
			mui.toast('您选择的日期是:' + (d.getMonth() + 1) + "-" + d.getDate());
			$('#pickDateBtn').text(d.getFullYear()+'-'+(d.getMonth() + 1)+'-'+d.getDate());
			searchToday((d.getMonth() + 1),d.getDate());
		}, function(e) {
//			mui.toast("您没有选择日期");
		}, {
			title: '请选择日期',
			date: dDate,
			minDate: minDate,
			maxDate: maxDate
		});
	});
//	document.getElementById("pickTimeBtn").addEventListener('tap', function() {
//		var dTime = new Date();
//		//设置默认时间
//		dTime.setHours(6, 0);
//		plus.nativeUI.pickTime(function(e) {
//			var d = e.date;
//			mui.toast("您选择的时间是：" + d.getHours() + ":" + d.getMinutes());
//		}, function(e) {
//			mui.toast("您没有选择时间");
//		}, {
//			title: "请选择时间",
//			is24Hour: true,
//			time: dTime
//		});
//	});
//	document.getElementsByClassName("touch-search")[0].addEventListener('tap', function() {
//
//	});
	
	
});
/**
 * 
 * 根据日期获得事件列表
 * 
 * @param {Object} searchMonth,searchDate
 */
function searchToday(searchMonth,searchDate){
	var date = searchMonth+''+searchDate;
	// 获取当前网络类型
	var nt = plus.networkinfo.getCurrentType();
	switch (nt){
		// 已开启网络
		case plus.networkinfo.CONNECTION_ETHERNET:
		case plus.networkinfo.CONNECTION_WIFI:
		case plus.networkinfo.CONNECTION_CELL2G:
		case plus.networkinfo.CONNECTION_CELL3G:
		case plus.networkinfo.CONNECTION_CELL4G:
			// 城市编号
			
			$.post("http://route.showapi.com/119-42",
				{
					"showapi_sign": "06bb75a7672b4b6b949dec894d2cce7c",
					"showapi_appid": "43995",
					"showapi_sign_method": "md5",
					"showapi_res_gzip": "1",
					"date": date
				}, function(data) {
					
					$('.mui-table-view').empty();
					if(data.showapi_res_code != 0) {
						mui.toast("资源获取失败！")
					} else {
						var list = data.showapi_res_body.list
						mui.each(list,function(key,value){
							var result_date = list[key].year+' - '+list[key].month+' - '+list[key].day;
							var result_title = list[key].title;
							var result_pic = list[key].img;
//							var result_des = jsondata.result[key].des;
//							var result_lunar = jsondata.result[key].lunar;
//							var result_id = jsondata.result[key]._id;
							if(result_pic==undefined){
								result_pic = '../images/huaji.png';
							}
							
							var childrenElement = $('<li></li>').addClass('mui-table-view-cell mui-collapse').append(
								$('<a></a>').addClass('mui-navigate-right').attr('href','#').append(
									$('<div></div>').addClass('div1').append(
										$('<span></span>').text(' — ● ')
									).append($('<span></span>').addClass('span1').text(result_date))
								)
							).append(
								$('<div></div>').addClass('mui-collapse-content md-trigger').attr('data-thing-id','result_id').append(
//									$('<p></p>').addClass('p0').text(result_title)
								).append(
									$('<div></div>').addClass('mui-card-header mui-card-media').append(
										$('<img />').attr('src',result_pic)
									).append(
										$('<div></div>').addClass('mui-media-body').append(
//											$('<span></span>').addClass('span2').text('result_lunar')
										).append(
											$('<p></p>').addClass('p1').text(result_title)
							))))
							
							$('.mui-table-view').append(childrenElement);
							
						});
					}
					
					
//					ModalEffects();
			});
			break;
			
		// 未开启网络连接
		default:
			mui.toast("当前网络异常，请检查网络设置！");
			break;
	}
}


/**
 * modalEffects.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
//var ModalEffects = (function() {
function ModalEffects(){
	function init() {

		var overlay = document.querySelector( '.md-overlay' );

		[].slice.call( document.querySelectorAll( '.md-trigger' ) ).forEach( function( el, i ) {

//			 el.setAttribute('data-modal','modal-1');
//			 console.log("1")
			var modal = document.querySelector( '#modal-1'),
//			var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) ),
				close = modal.querySelector( '.md-close' );

			function removeModal( hasPerspective ) {
				classie.remove( modal, 'md-show' );

				if( hasPerspective ) {
					classie.remove( document.documentElement, 'md-perspective' );
				}
			}

			function removeModalHandler() {
				removeModal( classie.has( el, 'md-setperspective' ) ); 
			}

			el.addEventListener( 'click', function( ev ) {
				classie.add( modal, 'md-show' );
				overlay.removeEventListener( 'click', removeModalHandler );
				overlay.addEventListener( 'click', removeModalHandler );
				//根据事件id查询详情
				var thingId = el.getAttribute( 'data-thing-id' )
				$.post("http://api.juheapi.com/japi/tohdet",
				{
					"v": "1.0",
					"id": thingId,
					"key":"7257fd599d694954dc1a6b028c4f48a9"
					
				}, function(data) {
					
					var jsondata = JSON.parse(data)
					
					var result_title = jsondata.result[0].title;
					var result_pic = jsondata.result[0].pic;
					var result_content = jsondata.result[0].content;
					var result_lunar = jsondata.result[0].lunar;
					//添加数据
					$('#tan-title').text(result_title);
					if(result_pic.length==0){
						result_pic = 'images/huaji.png';
					}
					$('#tan-pic').attr('src',result_pic);
					$('#tan-lunar').text(result_lunar);
					$('#tan-content').text(result_content);
				});
				
				
				
				if( classie.has( el, 'md-setperspective' ) ) {
					setTimeout( function() {
						classie.add( document.documentElement, 'md-perspective' );
					}, 25 );
				}
			});

			close.addEventListener( 'click', function( ev ) {
				ev.stopPropagation();
				removeModalHandler();
			});

		} );

	}

	init();
}
//})();


