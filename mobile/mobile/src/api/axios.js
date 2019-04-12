//JavaScript Document
import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
// 发送请求前处理request的数据
axios.defaults.transformRequest = [function (data) {
	let formData = '';
	for (let key in data) {
	  formData += key + '=' + data[key] + '&';
	}
	return formData.substring(0, formData.length - 1);
}];
// 带cookie请求
axios.defaults.withCredentials = true;

axios.interceptors.response.use(response => {
	//=>设置响应拦截器，在AJAX请求成功，执行对应方法之前，把从服务器获取的RESULT(包含了响应主体和响应头等很多信息)中的DATA获取到然后返回，这样在请求成功执行的函数中，再次遇到的RESULT只有响应主体内容
	return response.data;
});

export {
    axios
};