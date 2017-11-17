mui.init({
	    keyEventBind: {
	        backbutton: true  // 打开back按键监听
	    },
			// 配置具体需要监听的手势事件
		gestureConfig:{
			longtap: true,  // 手机端长按事件，默认为 false
		}
});
	    


mui.plusReady(function() {
	
/**
 * 滚动到一定距离，顶部城市显示区域颜色改变
 */
	$(window).scroll(function() {
		if ($(window).scrollTop() > 50) {
			
			var div = $('<div></div>').addClass('cur-temperature').append(
							$('<span></span>').addClass('cur-font-color').text('老黄历'));
			$('#titleheader').empty();
			$('#titleheader').append(div);
		} else {
			
			$('#titleheader').empty();
		}
	});


	var dDate = new Date();
	var getM = "";
	if((dDate.getMonth() + 1)<10){
		getM = "0"+(dDate.getMonth() + 1).toString();
	}else{
		getM = (dDate.getMonth() + 1);
	}
	var getDate = "";
	if((dDate.getDate())<10){
		getDate = "0"+dDate.getDate().toString();
	}else{
		getDate = dDate.getDate();
	}
	
	$('#pickDateBtn').text(dDate.getFullYear()+'-'+ getM +'-'+getDate);
	var Adate1 = dDate.getFullYear() +''+getM +''+ getDate;
	searchToday(Adate1);
	
	document.getElementById("pickDateBtn").addEventListener('tap', function() {
		var dDate = new Date();
		//设置当前日期（不设置默认当前日期）
		dDate.setFullYear(dDate.getFullYear(), dDate.getMonth(), dDate.getDate());
		
		var minDate = new Date();
		//最小时间
		minDate.setFullYear(dDate.getFullYear()-2,dDate.getMonth(), dDate.getDate());
		var maxDate = new Date();
		//最大时间
		maxDate.setFullYear(dDate.getFullYear()+3, dDate.getMonth(), dDate.getDate());
		
		plus.nativeUI.pickDate(function(e) {
			var d = e.date;
			if((d.getMonth() + 1)<10){
				getM = "0"+(d.getMonth() + 1).toString();
			}else{
				getM = (d.getMonth() + 1);
			}
			var getDate = "";
			if((d.getDate())<10){
				getDate = "0"+d.getDate().toString();
			}else{
				getDate = d.getDate();
			}
			mui.toast('您选择的日期是:' + d.getFullYear() + "-" + getM + "-" + getDate);
			$('#pickDateBtn').text(d.getFullYear()+'-'+ getM +'-'+getDate);
			var Adate2 = d.getFullYear() +''+getM +''+ getDate;
			searchToday(Adate2);
		}, function(e) {
//			mui.toast("您没有选择日期");
		}, {
			title: '请选择日期',
			date: dDate,
			minDate: minDate,
			maxDate: maxDate
		});
	});

	
	
});
/**
 * 
 * 根据日期获得事件列表
 * 
 * @param {Object} searchMonth,searchDate
 */
function searchToday(Adate){
//	console.log(Adate);
	// 获取当前网络类型
	var nt = plus.networkinfo.getCurrentType();
	switch (nt){
		// 已开启网络
		case plus.networkinfo.CONNECTION_ETHERNET:
		case plus.networkinfo.CONNECTION_WIFI:
		case plus.networkinfo.CONNECTION_CELL2G:
		case plus.networkinfo.CONNECTION_CELL3G:
		case plus.networkinfo.CONNECTION_CELL4G:
			
			$.post("http://route.showapi.com/856-1",{
					"showapi_sign": "06bb75a7672b4b6b949dec894d2cce7c",
					"showapi_appid": "43995",
					"showapi_sign_method": "md5",
					"showapi_res_gzip": "1",
					"date": Adate
				}, function(data) {
					
//					var jsondata = JSON.parse(data)
					
//					 var description = ""; 
//					 for(var i in data.showapi_res_body){ 
//					 	var property=data.showapi_res_body[i]; 
//					 	description+=i+" = "+property+"\n"; 
//					 } 
//					 alert(description); 
					if(data.showapi_res_code != 0) {
						mui.toast("资源获取失败！")
					} else {
						var data = data.showapi_res_body;
						$('#gongli').text(data.gongli);
						$('#nongli').text(data.nongli);
						$('#yi').text(data.yi);
						$('#ji').text(data.ji);
						$('#jieri').text(data.jieri);
						$('#ganzhi').text(data.ganzhi);
						$('#nayin').text(data.nayin);
						$('#shengxiao').text(data.shengxiao);
						$('#xingzuo').text(data.xingzuo);
						$('#shiershen').text(data.sheng12);
						$('#zhiri').text(data.zhiri);
						$('#chongsha').text(data.chongsha);
						$('#tsjf').text(data.tszf);
						$('#pzbj').text(data.pzbj);
						$('#jrhh').text(data.jrhh);
						$('#jsyq').text(data.jsyq);
						$('#jieqi24').text(data.jieqi24);
						$('#zishi').text(data.t23);
						$('#choushi').text(data.t1);
						$('#yinshi').text(data.t3);
						$('#maoshi').text(data.t5);
						$('#chenshi').text(data.t7);
						$('#sishi').text(data.t9);
						$('#wushi').text(data.t11);
						$('#weishi').text(data.t13);
						$('#shenshi').text(data.t15);
						$('#youshi').text(data.t17);
						$('#xushi').text(data.t19);
						$('#haishi').text(data.t21);
						
					}
					
					
					
			});
			break;
			
		// 未开启网络连接
		default:
			mui.toast("当前网络异常，请检查网络设置！");
			break;
	}
}


