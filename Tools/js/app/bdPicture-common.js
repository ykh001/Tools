/**
 * 一些通用方法
 */
(function(exports) {
    
    /**
     * 将string字符串转为html对象,默认创一个div填充
     * 因为很常用，所以单独提取出来了
     * @param {String} strHtml 目标字符串
     * @return {HTMLElement} 返回处理好后的html对象,如果字符串非法,返回null
     */
    exports.parseHtml = function(strHtml) {
        if (typeof strHtml !== 'string') {
            return strHtml;
        }
        // 创一个灵活的div
        var i,
            a = document.createElement('div');
        var b = document.createDocumentFragment();

        a.innerHTML = strHtml;

        while ((i = a.firstChild)) {
            b.appendChild(i);
        }

        return b;
    };

    /**
     * 将对象渲染到模板
     * @param {String} template 对应的目标
     * @param {Object} obj 目标对象
     * @return {String} 渲染后的模板
     */
    exports.renderTemplate = function(template, obj) {
        return template.replace(/[{]{2}([^}]+)[}]{2}/g, function($0, $1) {
            return obj[$1] || '';
        });
    };

    /**
     * 定义一个计数器
     */
    var counterArr = [0];
	var page = 0;
    /**
     * 添加测试数据
     * @param {String} dom 目标dom
     * @param {Number} count 需要添加的数量
     * @param {Boolean} isReset 是否需要重置，下拉刷新的时候需要
     * @param {Number} index 属于哪一个刷新
     */
    exports.appendTestData = function(dom, type, count, isReset, index) {
        if (typeof dom === 'string') {
            dom = document.querySelector(dom);
        }
       
        var prevTitle = typeof index !== 'undefined' ? ('Tab' + index) : '';
        
        var counterIndex = index || 0;
        
        counterArr[counterIndex] = counterArr[counterIndex] || 0;

        if (isReset) {
            dom.innerHTML = '';
            counterArr[counterIndex] = 0;
        }
        
        var template = '<li class="shuaxin_list"><a href="#"><div class="shuaxin_desc ">{{title}}</div><div class="shuaxin_desc">{{date}}</div><img class="shuaxin_img" src="{{picUrl}}"></a><div class="pic-down">下载</div></li>';
		
        var html = '',dateStr = '';
        
        var tag2 = GetQueryString("tag2");
        if(tag2 != null){
        	document.getElementById('picture-type2').innerHTML = tag2;
        }else{
        	tag2 = "全部"
        }
        
        //API开始
        $.get("http://image.baidu.com/channel/listjson?pn="+page+"&rn=10&tag1="+type+"&ie=utf8&tag2="+tag2, {
			
		}, function(data) {
			var jsonObj = JSON.parse(data);
			
			if(jsonObj.totalNum == 0) {
				mui.toast("获取失败！")
			} else {
				
				document.getElementById('picture-type').innerHTML = jsonObj.tag1;
				document.getElementById('picture-num').innerHTML = jsonObj.totalNum;
				
				var results = jsonObj.data;
				mui.each(results, function(key, value) {
					dateStr = results[key].desc;
//					console.log(dateStr)
					if(key<10){
						html += exports.renderTemplate(template, {
			                title: prevTitle + '【' + counterArr[counterIndex] + '】'+dateStr,
							picUrl:results[key].image_url,
			                date: results[key].date,
			            });
			            
			            counterArr[counterIndex]++;
					}
				});
				page++;
				var child = exports.parseHtml(html);

        		dom.appendChild(child);
				
			}
	
		});
		//API结束


    };

    /**
     * 绑定监听事件 暂时先用click
     * @param {String} dom 单个dom,或者selector
     * @param {Function} callback 回调函数
     * @param {String} eventName 事件名
     */
    exports.bindEvent = function(dom, callback, eventName) {
        eventName = eventName || 'click';
        if (typeof dom === 'string') {
            // 选择
            dom = document.querySelectorAll(dom);
        }
        if (!dom) {
            return;
        }
        if (dom.length > 0) {
            for (var i = 0, len = dom.length; i < len; i++) {
                dom[i].addEventListener(eventName, callback);
            }
        } else {
            dom.addEventListener(eventName, callback);
        }
    };
})(window.Common = {});