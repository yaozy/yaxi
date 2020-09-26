yaxi.Dialog = yaxi.Box.extend(function (Class, base, yaxi) {
	


	// 禁止作为子控件
	Class.allowParent = function (parent) {

		return parent instanceof yaxi.Page;
	}



    // 是否顶级控件
    this.isTopLevel = true;



	this.__find_up = function () {
	
		return null;
	}

	
	
	// 对话框加载前处理
	this.onloading = function (options) {
	}
	
	

	// 对话框加载后处理
	this.onload = function (options) {
	}
	

	// 对话框关闭前处理(返回false退停止关闭窗口)
	this.onunloading = function (options) {
	}


	// 对话框关闭后处理
	this.onunload = function (options) {
	}


	// 关闭窗口
	this.close = function (type, data) {

		var page = yaxi.currentPage;
		var options = this.options;

		if (page && this.onunloading(options) !== false)
		{
			this.remove();
			this.onunload(options);
    
			this.options = null;
			this.destroy();
	
			if (callback = this.__callback)
			{
				this.__callback = null;
				callback(type, data);
			}
		}
	}


	
	function open(options, callback) {

		var page = yaxi.currentPage;
		var dialog = new this(options);
        
		if (page && dialog.onloading(options) !== false)
		{
			dialog.options = options;
			dialog.__callback = callback;

			page.children.push(dialog);
			
			dialog.onload(options);
		}
	}


	this.__class_init = function (Class) {

		base.__class_init.call(this, Class);
		Class.open = open;
	}


	
	
}, function Dialog() {

	yaxi.Box.apply(this, arguments);

}).register('Dialog');
