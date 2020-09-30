yaxi.Box.extend('Page', function (Class, base) {


	
	// 禁止作为子控件
	Class.allowParent = false;




	this.__find_up = function () {
	
		return null;
	}

	
	
	// 页面加载前处理
	this.onloading = function (options) {
	}
	
	

	// 页面加载后处理
	this.onload = function (options) {
	}
	


	// 页面卸载前处理(返回false退停止关闭窗口)
	this.onunloading = function (options) {
	}


	// 页面卸载后处理
	this.onunload = function (options) {
	}


	// 关闭窗口
	this.close = function (type, payload) {

		yaxi.closePage(type, payload);
	}



	function open(options, callback) {

		yaxi.openPage(this, options, callback);
	}


	this.__class_init = function (Class) {

		base.__class_init.call(this, Class);
		Class.open = open;
	}


    
}, function Page() {


    yaxi.Box.apply(this, arguments);


});
