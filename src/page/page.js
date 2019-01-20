yaxi.Page = yaxi.Control.extend(function (Class, base) {




    var host = yaxi.__dom_host = document.createElement('div');

	host.className = 'yx-host';

    if (document.body)
    {
        document.body.appendChild(host);
    }
    else
    {
        document.addEventListener('DOMContentLoaded', function () {

            document.body.appendChild(host);
        });
	}
	
	
	if (yaxi.device === 'mobile')
	{
		// 处理rem自适应
		// 字体放大两倍, 然后设置页面为2倍屏幕宽度再缩小一半解决无法渲染1px像素问题
		document.documentElement.style.fontSize = (yaxi.rem = (window.innerWidth * 2 * 10000 / 375 | 0) / 100) + 'px';
		host.style.cssText = 'width:200%;height:200%;transform-origin: 0 0;transform: scale(.5, .5);';
	}
	else
	{
		// pc端1rem = 100px
		document.documentElement.style.fontSize = (yaxi.rem = 100) + 'px';
	}



	Class.all = function () {

		var list = [],
			page = Class.current;

		while (page)
		{
			list.push(page);
			page = page.opener;
		}

		return list.reverse();
	}


	Class.close = function (amount, closeType) {

		var page;

		if (typeof amount === 'string')
		{
			closeType = amount;
			amount = 1;
		}
		else
		{
			amount = amount || 1;
		}

		while (amount > 0 && (page = Class.current))
		{
			page.close(closeType);
			amount--;
		}

		return Class.current;
	}


	Class.closeTo = function (level, closeType) {

		var list = Class.all();

		level |= 0;

		for (var i = list.length - 1; i > level; i--)
		{
			list[i].close(closeType || 'OK');
		}

		return list[level];
	}


	Class.closeAll = function (closeType) {

		var page;

		while (page = Class.current)
		{
			page.close(closeType || 'OK');
		}
	}




	yaxi.template(this, '<div class="yx-control yx-page"></div>');



    // url基础路径(没置了此路径点击时将打开子项绑定的url)
	this.$property('base', '', true, 'baseURL');
	

	// 是否自动销毁
	this.$property('autoDestroy', true, false, 'auto-destroy');



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
				values.className = 'yx-header ' + (values.className || '');
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
			values.className = 'yx-content ' + (values.className || '');

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
			values.className = 'yx-footer ' + (values.className || '');

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



	// 注册检查布局事件
	yaxi.on('yaxi-check-layout', function () {

		var page;

		if ((page = this.Page.current) && page.$dom)
		{
			page.invalidate();
		}
	});



	this.open = function () {
				
		if (this.onopening() !== false && this.trigger('opening') !== false)
		{
			var opener = Class.current || null;
			
			var time = performance.now();

			Class.current = this;
			this.opener = opener;
			
			yaxi.__dom_host.appendChild(this.$dom || this.render());
			
			this.onmounted();

			this.openTime = new Date();
			this.onopened();
			this.onshow(true);

			if (opener)
			{
				opener.$dom.style.display = 'none';
				opener.onhide();
			}
			
			this.trigger('opened');
			this.invalidate();

			console.log('open page time: ' + (performance.now() - time) + 'ms');
		}

		return this;
	}
	
	
	this.close = function (closeType, payload) {
		
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

		var dom = this.$dom,
			opener = this.opener;
		
		this.onhide();
		this.onclosed(closeType, payload);

		if (dom && dom.parentNode)
		{
			dom.parentNode.removeChild(dom);
		}
		
		Class.current = opener;

		yaxi.toast.hide();

		event.type = 'closed';

		this.trigger(event, payload);
		this.opener = null;

		// 如果当前窗口是隐藏状态则显示当前窗口
		if ((opener = Class.current) && (dom = opener.$dom) && dom.style.display === 'none')
		{
			dom.style.display = '';

			opener.onshow();
			opener.invalidate();
		}

		if (this.autoDestroy)
		{
			// 延时销毁以加快页面切换速度
			setTimeout(this.destroy.bind(this), 100);
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

			if (style.top !== (value = this.header ? '' : 0))
			{
				style.top = value;
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
