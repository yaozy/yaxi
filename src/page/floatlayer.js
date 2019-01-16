yaxi.FloatLayer = yaxi.Panel.extend(function (Class, base) {
	


	var stack = yaxi.__layer_stack;



	yaxi.template(this, '<div class="yx-control yx-floatlayer"></div>');


		
	// 注册检查布局事件
	yaxi.on('yaxi-check-layout', function () {

		var list = stack,
			index = 0,
			item;

		while (item = list[index++])
		{
			if (item.$dom)
			{
				item.__check_layout();
			}
		}
		
	});
	

	
	
	this.show = function () {
		
		if (stack.indexOf(this) < 0)
		{
			var dom = this.$dom || (this.$dom = this.render());
			
			yaxi.__dom_host.appendChild(dom);
			stack.push(this);
		}

		return this;
	}
	
	
	
	this.showAt = function (x, y) {
		
		if (stack.indexOf(this) < 0)
		{
			var dom = this.$dom || (this.$dom = this.render());
			
			style = dom.style;
			style.left = x > 0 ? x + 'px' : x;
			style.top = y > 0 ? y + 'px' : y;
			
			yaxi.__dom_host.appendChild(dom);
			
			stack.push(this);
		}

		return this;
	}
	
	
	
	this.close = function (payload) {
		
		var parent, dom;

		if (stack[stack.length - 1] === this)
		{
            stack.pop();

            if ((dom = this.$dom) && (parent = dom.parentNode))
            {
                parent.removeChild(dom);
			}

			this.trigger('closed', payload);

			if (this.autoDestroy !== false)
            {
				this.destroy();
			}
		}
	}

	
	
}).register('FloatLayer');
