yaxi.Page = yaxi.Control.extend(function (Class, base) {


	
	// 窗口变化时调整布局
	window.addEventListener('resize', function () {

		var page = stack[stack.length - 1];

		if (page && page.$dom)
		{
			page.invalidate();
		}
	});




	// 页面栈
	var stack = Class.stack = [];



	Class.all = function () {

		return stack;
	}


	Class.close = function (amount, closeType) {

		var list = stack;

		if (typeof amount === 'string')
		{
			closeType = amount;
			amount = 1;
		}
		else
		{
			amount = amount || 1;
		}

		for (var i = list.length; i--;)
		{
			if (--amount < 0)
			{
				return;
			}

			list[i].close(closeType);
		}

		return list[list.length - 1] || null;
	}


	Class.closeTo = function (level, closeType) {

		var list = stack;

		level |= 0;

		for (var i = list.length - 1; i > level; i--)
		{
			list[i].close(closeType || 'OK');
		}

		return list[level] || null;
	}


	Class.closeAll = function (closeType) {

		var list = stack;

		for (var i = list.length; i--;)
		{
			list[i].close(closeType || 'OK');
		}
	}


	// 当前窗口
	Object.defineProperty(Class, 'current', {

		get: function () {

			return stack[stack.length - 1] || null;
		}
	});




	yaxi.template(this, '<div class="yx-control yx-page"></div>');



    // url基础路径(没置了此路径点击时将打开子项绑定的url)
	this.$property('base', '', false, 'baseURL');
	

	// 是否自动销毁
	this.$property('autoDestroy', true, false, 'auto-destroy');



	// 上一个页面
	Object.defineProperty(this, 'opener', {

		get: function () {

			var index = stack.indexOf(this);
			return index > 0 && stack[index - 1] || null;
		}
	});


	// 页头
	Object.defineProperty(this, 'header', {

		get: function () {

			return this.__header || (this.__header = find(this.__children, 'Header'));
		}
	});


	// 页内容区
	Object.defineProperty(this, 'content', {

		get: function () {

			return this.__content || (this.__content = find(this.__children, 'Content'));
		}
	});


	// 页脚
	Object.defineProperty(this, 'footer', {

		get: function () {

			return this.__footer || (this.__footer = find(this.__children, 'Footer'));
		}
	});
	


	function find(children, name) {

		for (var i = children.length; i--;)
		{
			if (children[i].typeName === name)
			{
				return children[i];
			}
		}
	}




	this.$converter.header = {
		
		fn: function (values) {
		
			var control;

			if (!values || typeof values !== 'object')
			{
				values = this.__template_header(values);
			}
			else
			{
				values.key = values.key || 'page-header';
			}

			control = new (values.Class || yaxi.Header)();
			control.parent = this;
			control.assign(values);

			this.__children.push(this.__header = control);
		}
	};


	this.__template_header = function (text) {
	
		return {
			Class: yaxi.Header,
			children: [
				{
					Class: yaxi.BackButton
				},
				{
					Class: yaxi.Title,
					text: text
				}
			]
		};
	}
	
	
	this.$converter.content = {
		
		fn: function (values) {
		
			var control;
			
			if (!values || typeof values !== 'object')
			{
				values = {
					Class: yaxi.Text,
					text: values
				};
			}

			values.key = values.key || 'page-content';

			control = new (values.Class || yaxi.Content)();
			control.parent = this;
			control.assign(values);

			this.__children.push(this.__content = control);
		}
	};
	
	
	this.$converter.footer = {
		
		fn: function (values) {
	
			var control;

			if (!values || typeof values !== 'object')
			{
				values = {
					Class: yaxi.Text,
					text: values
				};
			}

			values.key = values.key || 'page-footer';

			control = new (values.Class || yaxi.Footer)();
			control.parent = this;

			control.assign(values);

			this.__children.push(this.__footer = control);
		}
	};


	this.$converter.children = {

		fn: function (values) {

			var children = this.__children,
				control,
				options;

			for (var i = 0, l = values.length; i < l; i++)
			{
				options = values[i];
				control = new (options.Class || yaxi.Panel)();
				control.parent = this;

				children.push(control.assign(options));
			}
		}
	}




	this.__find_up = function () {
	
		return null;
	}

	
	
	// 扩展容器功能
	yaxi.impl.container.call(this, base);



	this.open = function () {

		var opener = stack[stack.length - 1];

		if (stack.indexOf(this) >= 0 ||
			this.onopening() === false ||
			this.trigger('opening') === false)
		{
			return this;
		}
		
		var time = performance.now();
		
		stack.push(this);

		yaxi.__dom_host.appendChild(this.$dom || this.render());
		
		this.onmounted();

		this.openTime = new Date();
		this.onopened();
		this.onshow(true);

		this.trigger('opened');
		this.invalidate();

		if (opener && opener.$dom)
		{
			opener.$dom.style.display = 'none';
			opener.onhide();
		}

		console.log('open page time: ' + (performance.now() - time) + 'ms');

		return this;
	}
	
	
	this.close = function (closeType, payload) {
		
		if (this.onclosing(closeType || (closeType = 'OK'), payload) === false)
		{
			return false;
		}

		// 关闭所有弹出层
		yaxi.FloatLayer.close();

		var event = new yaxi.Event('closing');

		event.closeType = closeType;

		if (this.trigger(event, payload) === false)
		{
			return false;
		}

		this.onhide();
		this.onclosed(closeType, payload);

		yaxi.toast.hide();

		try
		{
			event.type = 'closed';	
			this.trigger(event, payload);
		}
		finally
		{
			var index = stack.indexOf(this),
				opener,
				dom;

			if (index < 0)
			{
				index = stack.length;
			}
			else
			{
				stack.splice(index, 1);
			}

			// 关闭的是最后一个窗口时才显示上一个窗口
			if (index === stack.length && (opener = stack[index - 1]) && (dom = opener.$dom))
			{
				dom.style.display = '';
				opener.onshow(false);
			}

			if ((dom = this.$dom) && dom.parentNode)
			{
				dom.parentNode.removeChild(dom);
			}

			if (this.autoDestroy)
			{
				// 延时销毁以加快页面切换速度
				setTimeout(this.destroy.bind(this), 100);
			}
		}

		return true;
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



	
    this.render = function () {

        var dom = base.render.call(this),
            any;

        if (any = this.header)
        {
			any = any.render();
			any.classList.add('yx-header');

            dom.appendChild(any);
        }

        if (any = this.content)
        {
			any = any.render();
			any.classList.add('yx-content');

            dom.appendChild(any);
        }

        if (any = this.footer)
        {
			any = any.render();
			any.classList.add('yx-footer');

            dom.appendChild(any);
        }

        return dom;
    }
	


	this.invalidate = function () {

		if (this.$dom)
		{
			var children = this.__children,
				style = this.content.$dom.style,
				control,
				value;

			if (!this.header)
			{
				style.top = 0;
			}

			if ((control = this.footer) && style.bottom !== (value = control.$dom.offsetHeight + 'px'))
			{
				style.bottom = value;
			}

			for (var i = 0, l = children.length; i < l; i++)
			{
				control = children[i];

				if (control.$dom && control.invalidate)
				{
					control.invalidate();
				}
			}
		}
    }
	

	
	this.destroy = function () {

		var any;

		if (any = this.footer)
		{
			any.destroy();
		}

		if (any = this.content)
		{
			this.content.destroy();
		}
		
		if (any = this.header)
		{
			any.destroy();
		}

		base.destroy.call(this);

		if (any = this.$dom)
		{
			any.innerHTML = '';
		}
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


	Class.open = open;
	

    
}, function Page() {

	var init;

	this.$storage = Object.create(this.$defaults);

	this.key = 'page';
	this.__children = [];

	if (init = this.init)
	{
		init.apply(this, arguments);
	}

}).register('Page');
