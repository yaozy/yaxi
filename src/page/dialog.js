yaxi.Dialog = yaxi.Page.extend(function (Class) {
	
	
	
	var stack = Class.stack = [];
	
	var eventName = 'ontouchstart' ? 'touchstart' : 'mousedown';

    var mask = document.createElement('div');


	mask.className = 'yx-mask';
	


    yaxi.template(this, '<div class="yx-control yx-dialog"></div>');
	



	// 水平对齐方式
	// left: 左对齐
	// center: 居中对齐
	// right: 右对齐
	// custom: 自定义
	this.$property('alignX', 'center');


	// 竖直对齐方式
	// top: 上对齐
	// middle: 居中对齐
	// bottom: 下对齐
	// custom: 自定义
	this.$property('alignY', 'middle');


	// 是否自动关闭
	this.$property('autoClose', false, false);




	this.__template_header = function (text) {

		return {

			Class: yaxi.Title,
			text: text
		};
	}

	

	function checkTap(event) {
		
		var dialog = stack[stack.length - 1];
		
		if (dialog)
		{
			var dom = dialog.$dom,
				node = event.target;
				
			while (node)
			{
				if (node === dom)
				{
					return;
				}
				
				node = node.parentNode;
			}

			if (dialog.autoClose)
			{
				dialog.close();
			}

			event.stopImmediatePropagation();
			return false;
		}
	}



	function computePosition() {

		var dialog = stack[stack.length - 1],
			dom;

		if (dialog && (dom = dialog.$dom))
		{
			var style = dom.style;

			switch (dialog.alignY)
			{
				case 'top':
					style.top = 0;
					style.bottom = '';
					break;

				case 'middle':
					style.top = (window.innerHeight - dom.offsetHeight >> 1) + 'px';
					style.bottom = '';
					break;

				case 'bottom':
					style.top = '';
					style.bottom = 0;
					break;
			}

			switch (dialog.alignX)
			{
				case 'left':
					style.left = 0;
					style.right = '';
					break;

				case 'center':
					style.left = (window.innerWidth - dom.offsetWidth >> 1) + 'px';
					style.right = '';
					break;
				
				case 'right':
					style.left = '';
					style.right = 0;
					break;
			}
		}
	}


	
	this.open = function () {
		
		if (stack.indexOf(this) >= 0 || this.onopening() === false)
		{
			return false;
		}

		document.body.appendChild(mask);
		document.body.appendChild(this.$dom || this.render());

		// 打开弹出窗口时让出焦点
		var dom = document.activeElement;

		if (dom)
		{
			dom.blur();
		}

		this.onopened();
		this.onshow();

		this.trigger('opened');

		stack.push(this);
		computePosition.call(this);

		if (!stack[1])
		{
			document.addEventListener(eventName, checkTap, true);
			window.addEventListener('resize', computePosition, true);
		}

		return this;
	}
	
	
	
	this.close = function (closeType) {
		
		var index = stack.indexOf(this);

		if (index < 0 || this.onclosing(closeType) === false)
		{
			return false;
		}

		var dom = this.$dom;

		if (dom && dom.parentNode)
		{
			dom.parentNode.removeChild(dom);
		}

		if (dom = mask.parentNode)
		{
			dom.removeChild(mask);
		}

		stack.splice(index, 1);

		if (stack[0])
		{
			computePosition();
		}
		else
		{
			document.removeEventListener(eventName, checkTap, true);
			window.removeEventListener('resize', computePosition, true);
		}

		this.onhide();
		this.onclosed(closeType);

		this.trigger('closed', {

			closeType: closeType
		});

		if (this.autoDestroy)
		{
			this.destroy();
		}
	}
	


}).register('Dialog');
