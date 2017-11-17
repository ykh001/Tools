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
		queryPictureList();
		document.getElementById('tuijian').innerHTML = ''; //初始化推荐图列表

		var tuijian_index = 1;
//		queryTuijianOnePage();
//		queryListOne();
//		queryListTwo();
//		queryListThree();
//		queryListFour();

		var list1_index = 1;
		var list2_index = 1;
		var list3_index = 1;
		var list4_index = 1;
		
		
		//推荐页面下拉刷新，上拉加载。
		$('#scroll-tuijian').pullToRefresh({
			down: {

				callback: function() {
					var self = this;
					setTimeout(function() {
						queryTuijianMore(tuijian_index, 'first');
						tuijian_index++;
						self.endPullDownToRefresh();
					}, 1000);
				}
			},
			up: {
				callback: function() {
					var self = this;
					setTimeout(function() {
						queryTuijianMore(tuijian_index, 'end');
						tuijian_index++;
						self.endPullUpToRefresh();
					}, 1000);
				}
			}
		});

		//      循环所有分类页面下拉刷新，上拉加载。
		$.each(document.querySelectorAll('.mui-slider-group .list-scroll'), function(index, pullRefreshEl) {

			$(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						setTimeout(function() {

							var list_index = 0;
							if(index == 0) {
								list_index = list1_index;
								list1_index++;
							} else if(index == 1) {
								list_index = list2_index;
								list2_index++;
							} else if(index == 2) {
								list_index = list3_index;
								list3_index++;
							} else if(index == 3) {
								list_index = list4_index;
								list4_index++;
							}
							var ul = self.element.querySelector('.mui-table-view');
							queryListMore(index, list_index, 'first', ul);
							self.endPullDownToRefresh();
						}, 1000);
					}
				},
				up: {
					callback: function() {
						var self = this;
						setTimeout(function() {

							var list_index = 0;
							if(index == 0) {
								list_index = list1_index;
								list1_index++;
							} else if(index == 1) {
								list_index = list2_index;
								list2_index++;
							} else if(index == 2) {
								list_index = list3_index;
								list3_index++;
							} else if(index == 3) {
								list_index = list4_index;
								list4_index++;
							}
							var ul = self.element.querySelector('.mui-table-view');
							queryListMore(index, list_index, 'end', ul);
							self.endPullUpToRefresh();
						}, 1000);
					}
				}
			});
		});
		
		
		//下载图片
		$(document).on('click',".pic-down",function(e){
			var actionList = {
				title: '操作',
				cancel: "取消",
				buttons: [{
					title: "保存图片"
				}]
			};
			var imgSrc = this.previousSibling.src;
//			alert(this.previousSibling.src)
			//弹出actionSheet选项
			plus.nativeUI.actionSheet(actionList, function(e) {
				if(e.index == 1) {
					//创建一个下载任务
					var imgDtask = plus.downloader.createDownload(imgSrc, {
//						method: "GET"
					}, function(d, status) {
//						alert(d.filename)
						//下载完成的回调函数
						if(status == 200) {
							plus.gallery.save(d.filename, function() { //保存到相册
								plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
									entry.remove(); //删除临时文件
								});
								return mui.toast('图片已保存至相册');
							});
						} else {
							mui.toast("保存失败!" + status);
						}
					});
					imgDtask.start(); //开始下载任务
				}
			});
		});

	});
})(mui);

function queryPictureList() {
	$.post("http://route.showapi.com/1208-1", {
		"showapi_sign": "06bb75a7672b4b6b949dec894d2cce7c",
		"showapi_appid": "43995",
		"showapi_sign_method": "md5",
		"showapi_res_gzip": "1"
	}, function(data) {

		if(data.showapi_res_code != 0) {
			mui.toast("类别获取失败！")
		} else {

			$('#headerPicture').empty();
			//						//添加推荐类别
			var tuijian = $('<a></a>').addClass('mui-control-item mui-active').attr('href', '#item1mobile').text('推荐');
			$('#headerPicture').append(tuijian);

			var index = 1;
			mui.each(data.showapi_res_body.data, function(key, value) {

				var title = data.showapi_res_body.data[key].title;
				index++;
				var childrenElement = $('<a></a>').addClass('mui-control-item').attr('href', '#item' + index + 'mobile').text(title);

				$('#headerPicture').append(childrenElement);

			});
			//添加更多类别
			var gengduo = $('<a></a>').addClass('mui-control-item').attr('href', '#item6mobile').text('更多');
			$('#headerPicture').append(gengduo);

		}

	});
}

function queryTuijianOnePage() {

	$.post("http://route.showapi.com/197-1", {
		"showapi_sign": "06bb75a7672b4b6b949dec894d2cce7c",
		"showapi_appid": "43995",
		"showapi_sign_method": "md5",
		"showapi_res_gzip": "1", //为1则压缩
		"num": "10", //返回条数
		"page": 1, //分页
		"rand": "1" //为1则随机
	}, function(data) {

		if(data.showapi_res_code != 0) {
			mui.toast("推荐图获取失败！")
		} else {

			mui.each(data.showapi_res_body.newslist, function(key, value) {

				var picUrl = data.showapi_res_body.newslist[key].picUrl;
				var title = data.showapi_res_body.newslist[key].title;

				var childrenElement = $('<li></li>').addClass('mui-table-view-cell mui-media mui-col-xs-6').append(
					$('<a></a>').attr('href', '#').append(
						$('<img>').addClass('mui-media-object').attr('src', picUrl)
					).append(
						$('<div></div>').addClass('pic-down').text('下载')
					).append(
						$('<div></div>').addClass('mui-media-body').text(title)
					)
				);

				$('#tuijian').append(childrenElement);

			});
			
			

		}

	});
}

function queryListOne() {

	var ul = document.getElementById("list1");

	$.post("http://route.showapi.com/1208-2", {
		"showapi_sign": "06bb75a7672b4b6b949dec894d2cce7c",
		"showapi_appid": "43995",
		"showapi_sign_method": "md5",
		"showapi_res_gzip": "1", //为1则压缩
		"type": 1, //图片集类型ID
		"page": 1, //当前页码
		"rows": "10" //每页记录数
	}, function(data) {

		if(data.showapi_res_code != 0) {
			mui.toast("推荐图获取失败！")
		} else {

			mui.each(data.showapi_res_body.data, function(key, value) {

				var imgID = data.showapi_res_body.data[key].id;
				var title = data.showapi_res_body.data[key].title;
				var imgcount = data.showapi_res_body.data[key].imgcount;
				var imgurl = data.showapi_res_body.data[key].imgurl;
				var picUrl = imgurl.substring(0, imgurl.indexOf('?'));

				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media mui-col-xs-6';
				li.style.width = '50%';
				li.style.display = 'block';
				li.style.float = 'left';
				var aa = document.createElement('a');
				aa.setAttribute("onclick", "showDetail(this)");
				var img = document.createElement('img');
				img.className = 'mui-media-object';
				img.style.width = '100%';
				img.style.height = 'auto';
				img.style.maxWidth = '100%';
				img.setAttribute("src", picUrl);
				img.setAttribute("id", imgID);
				img.setAttribute("title", title);
				var dtitle = document.createElement('div');
				dtitle.className = 'mui-media-body';
				dtitle.innerHTML = '【' + imgcount + '】' + title;
				aa.appendChild(img);
				aa.appendChild(dtitle);
				li.appendChild(aa);

				ul.appendChild(li);
			});
		}
	});
}
function queryListTwo() {

	var ul = document.getElementById("list2");

	$.post("http://route.showapi.com/1208-2", {
		"showapi_sign": "06bb75a7672b4b6b949dec894d2cce7c",
		"showapi_appid": "43995",
		"showapi_sign_method": "md5",
		"showapi_res_gzip": "1", //为1则压缩
		"type": 2, //图片集类型ID
		"page": 1, //当前页码
		"rows": "10" //每页记录数
	}, function(data) {

		if(data.showapi_res_code != 0) {
			mui.toast("推荐图获取失败！")
		} else {

			mui.each(data.showapi_res_body.data, function(key, value) {

				var imgID = data.showapi_res_body.data[key].id;
				var title = data.showapi_res_body.data[key].title;
				var imgcount = data.showapi_res_body.data[key].imgcount;
				var imgurl = data.showapi_res_body.data[key].imgurl;
				var picUrl = imgurl.substring(0, imgurl.indexOf('?'));

				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media mui-col-xs-6';
				li.style.width = '50%';
				li.style.display = 'block';
				li.style.float = 'left';
				var aa = document.createElement('a');
				aa.setAttribute("onclick", "showDetail(this)");
				var img = document.createElement('img');
				img.className = 'mui-media-object';
				img.style.width = '100%';
				img.style.height = 'auto';
				img.style.maxWidth = '100%';
				img.setAttribute("src", picUrl);
				img.setAttribute("id", imgID);
				img.setAttribute("title", title);
				var dtitle = document.createElement('div');
				dtitle.className = 'mui-media-body';
				dtitle.innerHTML = '【' + imgcount + '】' + title;
				aa.appendChild(img);
				aa.appendChild(dtitle);
				li.appendChild(aa);

				ul.appendChild(li);
			});
		}
	});
}
function queryListThree() {

	var ul = document.getElementById("list3");

	$.post("http://route.showapi.com/1208-2", {
		"showapi_sign": "06bb75a7672b4b6b949dec894d2cce7c",
		"showapi_appid": "43995",
		"showapi_sign_method": "md5",
		"showapi_res_gzip": "1", //为1则压缩
		"type": 3, //图片集类型ID
		"page": 1, //当前页码
		"rows": "10" //每页记录数
	}, function(data) {

		if(data.showapi_res_code != 0) {
			mui.toast("推荐图获取失败！")
		} else {

			mui.each(data.showapi_res_body.data, function(key, value) {

				var imgID = data.showapi_res_body.data[key].id;
				var title = data.showapi_res_body.data[key].title;
				var imgcount = data.showapi_res_body.data[key].imgcount;
				var imgurl = data.showapi_res_body.data[key].imgurl;
				var picUrl = imgurl.substring(0, imgurl.indexOf('?'));

				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media mui-col-xs-6';
				li.style.width = '50%';
				li.style.display = 'block';
				li.style.float = 'left';
				var aa = document.createElement('a');
				aa.setAttribute("onclick", "showDetail(this)");
				var img = document.createElement('img');
				img.className = 'mui-media-object';
				img.style.width = '100%';
				img.style.height = 'auto';
				img.style.maxWidth = '100%';
				img.setAttribute("src", picUrl);
				img.setAttribute("id", imgID);
				img.setAttribute("title", title);
				var dtitle = document.createElement('div');
				dtitle.className = 'mui-media-body';
				dtitle.innerHTML = '【' + imgcount + '】' + title;
				aa.appendChild(img);
				aa.appendChild(dtitle);
				li.appendChild(aa);

				ul.appendChild(li);
			});
		}
	});
}
function queryListFour() {

	var ul = document.getElementById("list4");

	$.post("http://route.showapi.com/1208-2", {
		"showapi_sign": "06bb75a7672b4b6b949dec894d2cce7c",
		"showapi_appid": "43995",
		"showapi_sign_method": "md5",
		"showapi_res_gzip": "1", //为1则压缩
		"type": 4, //图片集类型ID
		"page": 1, //当前页码
		"rows": "10" //每页记录数
	}, function(data) {

		if(data.showapi_res_code != 0) {
			mui.toast("推荐图获取失败！")
		} else {

			mui.each(data.showapi_res_body.data, function(key, value) {

				var imgID = data.showapi_res_body.data[key].id;
				var title = data.showapi_res_body.data[key].title;
				var imgcount = data.showapi_res_body.data[key].imgcount;
				var imgurl = data.showapi_res_body.data[key].imgurl;
				var picUrl = imgurl.substring(0, imgurl.indexOf('?'));

				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media mui-col-xs-6';
				li.style.width = '50%';
				li.style.display = 'block';
				li.style.float = 'left';
				var aa = document.createElement('a');
				aa.setAttribute("onclick", "showDetail(this)");
				var img = document.createElement('img');
				img.className = 'mui-media-object';
				img.style.width = '100%';
				img.style.height = 'auto';
				img.style.maxWidth = '100%';
				img.setAttribute("src", picUrl);
				img.setAttribute("id", imgID);
				img.setAttribute("title", title);
				var dtitle = document.createElement('div');
				dtitle.className = 'mui-media-body';
				dtitle.innerHTML = '【' + imgcount + '】' + title;
				aa.appendChild(img);
				aa.appendChild(dtitle);
				li.appendChild(aa);

				ul.appendChild(li);
			});
		}
	});
}

function queryTuijianMore(tuijian_index, location) {

	$.post("http://route.showapi.com/197-1", {
		"showapi_sign": "06bb75a7672b4b6b949dec894d2cce7c",
		"showapi_appid": "43995",
		"showapi_sign_method": "md5",
		"showapi_res_gzip": "1", //为1则压缩
		"num": "10", //返回条数
		"page": tuijian_index, //分页
		"rand": "1" //为1则随机
	}, function(data) {

		if(data.showapi_res_code != 0) {
			mui.toast("推荐图获取失败！")
		} else {

			var tuijian = document.getElementById("tuijian")
			mui.each(data.showapi_res_body.newslist, function(key, value) {

				var picUrl = data.showapi_res_body.newslist[key].picUrl;
				var title = data.showapi_res_body.newslist[key].title;

				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media mui-col-xs-6';
				var aa = document.createElement('a');
				aa.setAttribute("href", "#");
				var img = document.createElement('img');
				img.className = 'mui-media-object';
				img.setAttribute("src", picUrl);
				var divv = document.createElement('div');
				divv.className = 'pic-down';
				divv.innerHTML = '下载';
				var dtitle = document.createElement('div');
				dtitle.className = 'mui-media-body';
				dtitle.innerHTML = title;
				aa.appendChild(img);
				aa.appendChild(divv);
				aa.appendChild(dtitle);
				li.appendChild(aa);

				if(location == "first") {
					tuijian.insertBefore(li, tuijian.firstChild);
				} else if(location == "end") {
					tuijian.appendChild(li);
				}

			});

		}

	});
}

function queryListMore(listType, list_index, location, ul) {

	$.post("http://route.showapi.com/1208-2", {
		"showapi_sign": "06bb75a7672b4b6b949dec894d2cce7c",
		"showapi_appid": "43995",
		"showapi_sign_method": "md5",
		"showapi_res_gzip": "1", //为1则压缩
		"type": (listType + 1), //图片集类型ID
		"page": list_index, //当前页码
		"rows": "10" //每页记录数
	}, function(data) {

		if(data.showapi_res_code != 0) {
			mui.toast("推荐图获取失败！")
		} else {

			mui.each(data.showapi_res_body.data, function(key, value) {

				var imgID = data.showapi_res_body.data[key].id;
				var title = data.showapi_res_body.data[key].title;
				var imgcount = data.showapi_res_body.data[key].imgcount;
				var imgurl = data.showapi_res_body.data[key].imgurl;
				var picUrl = imgurl.substring(0, imgurl.indexOf('?'));

				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media mui-col-xs-6';
				li.style.width = '50%';
				li.style.display = 'block';
				li.style.float = 'left';
				var aa = document.createElement('a');
				aa.setAttribute("onclick", "showDetail(this)");
				var img = document.createElement('img');
				img.className = 'mui-media-object';
				img.style.width = '100%';
				img.style.height = 'auto';
				img.style.maxWidth = '100%';
				img.setAttribute("src", picUrl);
				img.setAttribute("id", imgID);
				img.setAttribute("title", title);
				//				img.setAttribute("aa",imgcount);
				var dtitle = document.createElement('div');
				dtitle.className = 'mui-media-body';
				dtitle.innerHTML = '【' + imgcount + '】' + title;
				aa.appendChild(img);
				aa.appendChild(dtitle);
				li.appendChild(aa);

				if(location == "first") {
					ul.insertBefore(li, ul.firstChild);
				} else if(location == "end") {
					ul.appendChild(li);
				}

			});

		}

	});
}

//去详情页
function showDetail(element) {
	var imgId = element.firstChild.id;
	var title = element.firstChild.title;

	var newWV = plus.webview.create('pictureDetail.html?imgId=' + imgId + '&title=' + title, 'new');
	newWV.show('slide-in-right', 200);

}
//$("li").delegate("a","click",this,function(){
//	var imgId = this.firstChild.id;
//	var title = this.firstChild.title;
//	
//	var newWV = plus.webview.create('pictureDetail.html?imgId=' + imgId + '&title=' + title, 'new');
//	newWV.show('slide-in-right', 200);
//	
//});
