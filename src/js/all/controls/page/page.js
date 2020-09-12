yaxi.Page = yaxi.Panel.extend(function (Class, base) {



	var define = Object.defineProperty;

	
	// 页面栈
	var all = [];


	
	// 禁止作为子控件
	Class.allowParent = false;



	// 所有窗口
	define(Class, 'all', {

		get: function () {

			return all;
		}
	});


	// 当前窗口
	define(Class, 'current', {

		get: function () {

			return all[all.length - 1] || null;
		}
	});



	Class.close = function (amount, closeType) {

		if (typeof amount === 'string')
		{
			closeType = amount;
			amount = 1;
		}
		else
		{
			amount = amount || 1;
		}

		for (var i = all.length; i--;)
		{
			if (--amount < 0)
			{
				return;
			}

			all[i].close(closeType);
		}

		return all[all.length - 1] || null;
	}


	Class.closeTo = function (level, closeType) {

		level |= 0;

		for (var i = all.length - 1; i > level; i--)
		{
			all[i].close(closeType || 'OK');
		}

		return all[level] || null;
	}


	Class.closeAll = function (closeType) {

		for (var i = all.length; i--;)
		{
			all[i].close(closeType || 'OK');
		}
	}



	
	this.index = function () {

		return all.indexOf(this);
	}



	this.__find_up = function () {
	
		return null;
	}

	

	this.open = function () {

		if (all.indexOf(this) >= 0 ||
			this.onopening() === false ||
			this.trigger('opening') === false)
		{
			return;
		}

		all.push(this);

		// 触发全局事件通知窗口打开, 以便其它平台处理
		var event = new yaxi.Event('yaxi-page-change');

		event.index = all.length - 1;
		event.page = this;
		event.open = true;
		event.callback = '__open';

		this.removeClass('yx-hidden');

		yaxi.trigger(event);
	}


	this.__open = function (index) {

		var last;

		if (last = all[index - 1])
		{
			last.addClass('yx-hidden');
			last.onhide();
		}

		this.onopened();
		this.onshow(true);

		this.trigger('opened');
	}
	
	
	
	this.close = function (closeType, payload) {
		
		var index = all.indexOf(this);

		if (index < 0)
		{
			return false;
		}

		if (this.onclosing(closeType || (closeType = 'OK'), payload) === false)
		{
			return false;
		}

		var event = new yaxi.Event('closing');

		event.closeType = closeType;

		if (this.trigger(event, payload) === false)
		{
			return false;
		}

		all.splice(index, 1);

		// 触发全局事件通知窗口关闭, 以便其它平台处理
		event = new yaxi.Event('yaxi-page-change');
		event.index = all.length;
		event.page = this;
		event.callback = '__close';

		yaxi.trigger(event);
	}


	this.__close = function (index) {

		var event = new yaxi.Event('closed');

		this.onhide();
		this.onclosed();

		this.trigger(event);

		// 延时销毁以加快页面切换速度
		setTimeout(this.destroy.bind(this), 10);

		// 关闭的是最后一个窗口时才显示上一个窗口
		if (index > 0 && index === all.length)
		{
			var page = all[index - 1];

			page.removeClass('yx-hidden');
			page.onshow(false);
		}
	}
	
	
	this.onopening = function () {
	}
	
	
	this.onopened = function () {
		
	}
	
	
	this.onclosing = function (closeType, payload) {
	}
	
	
	this.onclosed = function (closeType, payload) {
		
	}


	this.onshow = function (first) {

	}


	this.onhide = function () {

	}


	
	
    this.__class_init = function (Class) {

		base.__class_init.call(this, Class);
		Class.open = open;
	}



	function open() {

		var page;

		if (arguments.length > 0)
		{
			page = Object.create(this.prototype);
			this.apply(page, arguments);
		}
		else
		{
			page = new this();
		}

		return page.open();
	}


    
}, function Page() {

    yaxi.Panel.apply(this, arguments);

}).register('Page');
