yaxi.FloatLayer = yaxi.Panel.extend(function (Class, base) {
	


	var stack = yaxi.__layer_stack;



	yaxi.template(this, '<div class="$class"></div>');



	Class.close = function () {

		var list = stack;

		for (var i = list.length; i--;)
		{
			list[i].close();
		}
	}

	
	
	this.show = function () {
		
		if (stack.indexOf(this) < 0)
		{
			var view = this.$view || (this.$view = this.render());
			
			yaxi.__view_host.appendChild(view);
			stack.push(this);
		}

		return this;
	}
	
	
	
	this.showAt = function (x, y) {
		
		if (stack.indexOf(this) < 0)
		{
			var view = this.$view || (this.$view = this.render());
			
			style = view.style;
			style.left = x > 0 ? x + 'px' : x;
			style.top = y > 0 ? y + 'px' : y;
			
			yaxi.__view_host.appendChild(view);
			
			stack.push(this);
		}

		return this;
	}
	
	
	
	this.close = function (payload) {
		
		var parent, view;

		if (stack[stack.length - 1] === this)
		{
            stack.pop();

            if ((view = this.$view) && (parent = view.parentNode))
            {
                parent.removeChild(view);
			}

			this.trigger('closed', payload);
			this.destroy();
		}
	}

	
	
}).register('FloatLayer');
