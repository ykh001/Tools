
//获取地址栏参数
function GetQueryString(name)
{
//   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//   var r = window.location.search.substr(1).match(reg);
//   if(r!=null)return  unescape(r[2]); return null;
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");   
    var r = window.location.search.substr(1).match(reg);   
    if (r != null) return decodeURI(r[2]); return null;   
}
