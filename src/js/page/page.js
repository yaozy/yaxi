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



	Class.ctor = function (data) {

		this.$storage = create(this.__defaults);

		this.key = 'page';
		this.__children = [];

		if (data)
		{
			this.__init(data);
		}
	}

	


	// 页头
	this.header = null;


	// 页体
	this.content = null;


	// 页脚
	this.footer = null;



	// 是否自动销毁
	this.$property('autoDestroy', true);

		


	this.__convert_header = [0, function (data) {
		
		var control;

		if (data && typeof data === 'object')
		{
			control = new (data.Class || yaxi.Panel)(data);
		}
		else
		{
			control = new yaxi.Panel({
				children: [
					{
						Class: yaxi.BackButton
					},
					{
						Class: yaxi.Title,
						text: data
					}
				]
			});
		}
		
		control.parent = this;
		control.key = 'page-header';
		control.$className = 'yx-header';

		this.__children.push(this.header = control);
	}];
	
	
	this.__convert_content = [0, function (data) {
		
		var control;
		
		if (data && typeof data === 'object')
		{
			control = new (data.Class || yaxi.Panel)(data);
		}
		else
		{
			control = new yaxi.Text();
			control.text = data;
		}

		control.parent = this;
		control.key = 'page-content';
		control.$className = 'yx-content';

		this.__children.push(this.content = control);
	}];
	
	
	this.__convert_footer = [0, function (data) {
	
		var control;

		if (data && typeof data === 'object')
		{
			control = new (data.Class || yaxi.Panel)(data);
		}
		else
		{
			control = new yaxi.Text();
			control.text = data;
		}

		control.parent = this;
		control.key = 'page-footer';
		control.$className = 'yx-footer';

		this.__children.push(this.footer = control);
	}];

	

	function onfocus(event) {

		event.target.blur();
		removeFocusEvent();
	}


	function removeFocusEvent() {

		document.removeEventListener('focus', onfocus, true);
		onfocus.enabled = 0;
	}



	this.__find_up = function () {
	
		return null;
	}

	
	// 扩展容器功能
	yaxi.container.call(this, base, true);




	this.open = function (options) {
				
		var opener = Class.current || null;
		
		if (this.onopening(options) !== false)
		{
			var dom = this.$dom || this.render();

			document.body.appendChild(dom);
			
			Class.current = this;
			
		    this.opener = opener;

			this.onopened(options);
			this.onshow();

			if (!onfocus.enabled)
			{
				document.addEventListener('focus', onfocus, true);
				onfocus.enabled = 1;
			}

			setTimeout(removeFocusEvent, 300);
			
			if (opener)
			{
				opener.$dom.style.display = 'none';
				opener.onhide();
			}
			
			this.trigger('opened');
			
			return true;
		}

		return false;
	}
	
	
	this.close = function (closeType) {
		
		if (this.onclosing(closeType) !== false)
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
			
			return true;
		}
		
		return false;
	}
	
	
	this.onopening = function (options) {
		
	}
	
	
	this.onopened = function (options) {
		
	}
	
	
	this.onclosing = function (closeType) {
		
	}
	
	
	this.onclosed = function (closeType) {
		
	}


	this.onshow = function () {

	}


	this.onhide = function () {

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
	
	
    
}).register('Page');
