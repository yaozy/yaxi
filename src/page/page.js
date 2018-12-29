yaxi.Page = yaxi.Control.extend(function (Class, base) {



	var create = Object.create;



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



	Class.ctor = function (values) {

		var init;

		this.$storage = create(this.$defaults);

		this.key = 'page';
		this.__children = [];

        if (init = this.init)
		{
			init.apply(this, arguments);
        }

		if (values)
		{
			this.assign(values);
		}
	}

	


	// 页头
	this.header = null;


	// 页体
	this.content = null;


	// 页脚
	this.footer = null;



	// 是否自动销毁
	this.$property('autoDestroy', true, false);

		


	this.$converter.header = {
		
		fn: function (values) {
		
			var control;

			if (!values || typeof values !== 'object')
			{
				values = this.__template_header(values);
			}
			
			values.key = values.key || 'page-header';
			values.className = 'yx-header ' + (values.className || '');

			control = new (values.Class || yaxi.Panel)();
			control.parent = this;

			control.assign(values);

			this.__children.push(this.header = control);
		}
	};


	this.__template_header = function (text) {
	
		return {
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

			control = new (values.Class || yaxi.Panel)();
			control.parent = this;
			control.assign(values);

			this.__children.push(this.content = control);
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

			control = new (values.Class || yaxi.Panel)();
			control.parent = this;

			control.assign(values);

			this.__children.push(this.footer = control);
		}
	};




	this.__find_up = function () {
	
		return null;
	}

	
	// 扩展容器功能
	yaxi.container.call(this, base);




	this.open = function () {
				
		var opener = Class.current || null;
		
		if (this.onopening() !== false)
		{
			yaxi.__dom_host.appendChild(this.$dom || this.render());
			
			Class.current = this;
		    this.opener = opener;

			this.onopened();
			this.onshow(true);

			if (opener)
			{
				opener.$dom.style.display = 'none';
				opener.onhide();
			}
			
			this.trigger('opened');
			this.openTime = new Date();
		}

		return this;
	}
	
	
	this.close = function (closeType) {
		
		if (this.onclosing(closeType || (closeType = 'OK')) !== false)
		{
			var opener = this.opener || null,
				dom = this.$dom;
			
			this.onhide();
			this.onclosed(closeType);
			this.opener = null;
			
			if (dom.parentNode)
			{
				dom.parentNode.removeChild(dom);
			}
			
			if (opener)
			{
				opener.$dom.style.display = '';
				opener.onshow();
			}

			Class.current = opener;
			
			this.trigger('closed', { closeType: closeType });

			yaxi.toast.hide();
			
			if (this.autoDestroy)
			{
				// 延时销毁以加快页面切换速度
				setTimeout(this.destroy.bind(this), 100);
			}
		}
	}
	
	
	this.onopening = function () {
		
	}
	
	
	this.onopened = function () {
		
	}
	
	
	this.onclosing = function (closeType) {
		
	}
	
	
	this.onclosed = function (closeType) {
		
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
	}
	

    
}).register('Page');
