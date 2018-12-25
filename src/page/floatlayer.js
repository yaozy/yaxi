yaxi.FloatLayer = yaxi.Panel.extend(function (Class, base) {
	


	var stack = yaxi.__layer_stack;



	yaxi.template(this, '<div class="yx-control yx-floatlayer"></div>');


	
	
	this.show = function () {
		
		if (stack.indexOf(this) < 0)
		{
			var dom = this.$dom || (this.$dom = this.render());
			
			document.body.appendChild(dom);
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
			
			document.body.appendChild(dom);
			
			stack.push(this);
		}

		return this;
	}
	
	
	
	this.close = function () {
		
		var parent, dom;

		if (stack[stack.length - 1] === this)
		{
            stack.pop();

            if ((dom = this.$dom) && (parent = dom.parentNode))
            {
                parent.removeChild(dom);
			}

			this.trigger('closed');

			if (this.autoDestroy !== false)
            {
				this.destroy();
			}
		}
	}

	
	
}).register('FloatLayer');
