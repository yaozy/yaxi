yaxi.Page = yaxi.Panel.extend(function (Class, base) {


	
	// 禁止作为子控件
	Class.allowParent = false;



	this.__find_up = function () {
	
		return null;
	}

	
	
	this.onopening = function (payload) {
	}
	
	
	this.onopened = function (payload) {
	}
	
	
	this.onclosed = function (payload) {
	}


    
}, function Page() {

    yaxi.Panel.apply(this, arguments);

}).register('Page');
