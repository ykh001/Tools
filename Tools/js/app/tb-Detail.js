mui.init({
	keyEventBind: {
		backbutton: true // 打开back按键监听
	},
	// 配置具体需要监听的手势事件
	gestureConfig: {
		longtap: true, // 手机端长按事件，默认为 false
	}
	
});

(function($) {
	//阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	$.ready(function() {
		
		var index = 1;
		queryListOne(index);
		
		//上拉加载。
		$('#scroll-tuijian').pullToRefresh({
			up: {
				callback: function() {
					var self = this;
					setTimeout(function() {

						queryListOne(index++);
						self.endPullUpToRefresh();
					}, 1000);
				}
			}
		});
		
		

	});

})(mui);

//获取地址栏参数
function GetQueryString(name) {
	//   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	//   var r = window.location.search.substr(1).match(reg);
	//   if(r!=null)return  unescape(r[2]); return null;
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return decodeURI(r[2]);
	return null;
}

var type = GetQueryString("type");

function queryListOne(index) {

	var ul = document.getElementById("ul-content");
	
//	alert(type+index)
	$.post("http://route.showapi.com/126-2", {
		"showapi_sign": "06bb75a7672b4b6b949dec894d2cce7c",
		"showapi_appid": "43995",
		"showapi_sign_method": "md5",
		"showapi_res_gzip": "1", //为1则压缩
		"type": type, //淘女郎风格
		"page": index, //查询第几页

	}, function(data) {

		if(data.showapi_res_code != 0) {
			mui.toast("推荐图获取失败！")
		} else {
			
			var allPages = data.showapi_res_body.pagebean.allPages; //所有页
			var currentPage = data.showapi_res_body.pagebean.currentPage; //当前页
			var allNum = data.showapi_res_body.pagebean.allNum; //所有数量
			var maxResult = data.showapi_res_body.pagebean.maxResult; //每页最大数量

			//显示总数
			var spancount = document.getElementById("allNum");
			spancount.innerHTML = allNum;

			mui.each(data.showapi_res_body.pagebean.contentlist, function(key, value) {
				var contentlist = data.showapi_res_body.pagebean.contentlist;

				var avatarUrl = contentlist[key].avatarUrl; //头像图片地址
				var imgList = contentlist[key].imgList; //模特图片地址列表
				var realName = contentlist[key].realName; //名字
				var city = contentlist[key].city; //所在城市			

				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-collapse';
				var aa = document.createElement('a');
				aa.className = 'mui-navigate-right';
				aa.setAttribute("id", "nameAndCity");
				aa.setAttribute("href", "#");
				aa.innerHTML = realName + "-" + city;
				var dd1 = document.createElement('div');
				dd1.className = 'mui-collapse-content';

				if(avatarUrl.length != 0) {
					var pp = document.createElement('p');
					var img = document.createElement('img');
					img.setAttribute("data-preview-src", "");
					img.setAttribute("data-preview-group", "1");
					img.setAttribute("src", avatarUrl);
					var dd2 = document.createElement('div');
					dd2.className = 'pic-down';
					dd2.innerHTML = "下载";

					pp.appendChild(img);
					pp.appendChild(dd2);
					dd1.appendChild(pp);
				}
				mui.each(imgList, function(key, value) {
					var pp = document.createElement('p');
					var img = document.createElement('img');
					img.setAttribute("data-preview-src", "");
					img.setAttribute("data-preview-group", "1");
					img.setAttribute("src", imgList[key]);
					var dd2 = document.createElement('div');
					dd2.className = 'pic-down';
					dd2.innerHTML = "下载";

					pp.appendChild(img);
					pp.appendChild(dd2);
					dd1.appendChild(pp);
				});

				li.appendChild(aa);
				li.appendChild(dd1);

				ul.appendChild(li);
			});
		}
	});
}