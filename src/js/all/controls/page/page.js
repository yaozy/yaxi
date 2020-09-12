yaxi.Page = yaxi.Box.extend(function (Class, base) {


	
	// 禁止作为子控件
	Class.allowParent = false;



	this.__find_up = function () {
	
		return null;
	}

	
	
	this.onopening = function (payload) {
	}
	
	
	this.onopened = function (payload) {
	}
	
	
	this.onclosed = function () {
	}



	function open(payload, callback) {

		yaxi.openPage(this, payload, callback);
	}


	this.__class_init = function (Class) {

		base.__class_init.call(this, Class);
		Class.open = open;
	}


    
}, function Page() {

    yaxi.Box.apply(this, arguments);

}).register('Page');
