yaxi.Dialog = yaxi.Page.extend(function (Class) {
	
	
	
	var stack = Class.stack = [];
	
	var eventName = 'ontouchstart' ? 'touchstart' : 'mousedown';

    var mask = document.createElement('div');


	mask.className = 'yx-mask';
	

	

    yaxi.template(this, '<div class="$class"></div>');
	



	// 水平对齐方式
	// left: 左对齐
	// center: 居中对齐
	// right: 右对齐
	// custom: 自定义
	this.$property('alignX', 'center', true, 'align-x');


	// 竖直对齐方式
	// top: 上对齐
	// middle: 居中对齐
	// bottom: 下对齐
	// custom: 自定义
	this.$property('alignY', 'middle', true, 'align-y');


	// 是否自动关闭
	this.$property('autoClose', false, false, 'auto-close');




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
			var view = dialog.$view,
				node = event.target;
				
			while (node)
			{
				if (node === view)
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

		var host = yaxi.__view_host,
			dialog = stack[stack.length - 1],
			view;

		if (dialog && (view = dialog.$view))
		{
			var style = view.style;

			switch (dialog.alignY)
			{
				case 'top':
					style.top = 0;
					style.bottom = '';
					break;

				case 'middle':
					style.top = (host.clientHeight - view.offsetHeight >> 1) + 'px';
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
					style.left = (host.clientWidth - view.offsetWidth >> 1) + 'px';
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
		
		if (stack.indexOf(this) >= 0 ||
			this.onopening() === false ||
			this.trigger('opening') === false)
		{
			return this;
		}

		var host = yaxi.__view_host;

		host.appendChild(mask);
		host.appendChild(this.$view || this.render());

		this.onopened();
		this.onshow();

		stack.push(this);
		computePosition.call(this);

		if (!stack[1])
		{
			document.addEventListener(eventName, checkTap, true);
			window.addEventListener('resize', computePosition, true);
		}

		this.trigger('opened');

		return this;
	}
	
	
	
	this.close = function (closeType, payload) {
		
		var index = stack.indexOf(this);

		if (index < 0 || this.onclosing(closeType || (closeType = 'OK'), payload) === false)
		{
			return false;
		}

		var event = new yaxi.Event('closing');

		event.closeType = closeType;

		if (this.trigger(event, payload) === false)
		{
			return false;
		}

		var view = this.$view;

		stack.splice(index, 1);

		if (view && view.parentNode)
		{
			view.parentNode.removeChild(view);
		}

		if (view = mask.parentNode)
		{
			if (stack[0])
			{
				view = stack[status.length - 1].$view;
				view.parentNode.insertBefore(mask, view);
			}
			else
			{
				view.removeChild(mask);
			}
		}

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
		this.onclosed(closeType, payload);

		event.type = 'closed';
		
		this.trigger(event, payload);
		this.destroy();

		return true;
	}



}).register('Dialog');
