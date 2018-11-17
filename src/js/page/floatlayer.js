yaxi.FloatLayer = yaxi.Panel.extend(function (Class, base) {
	
	
	
	var stack = [];
	
	
	
	document.addEventListener('ontouchstart' ? 'touchstart' : 'mousedown', function (event) {
		
		var layer = stack[stack.length - 1];
		
		if (layer)
		{
			var root = layer.$dom,
				node = event.target;
				
			while (node)
			{
				if (node === root)
				{
					return;
				}
				
				node = node.parentNode;
			}

			layer.close();
			
			event.stopPropagation();
			event.preventDefault();
			
			return false;
		}
		
	}, true);
	
	
	
	
	this.show = function (reference, offset) {
		
		var rect = reference.getBoundingClientRect(),
			offsetX = offset ? (offset.x | 0) : 0,
			offsetY = offset ? (offset.y | 0) : 0;
		
		this.showAt(rect.left + offsetX, rect.top + reference.offsetHeight + offsetY);
	}
	
	
	
	this.showAt = function (x, y) {
		
		if (stack.indexOf(this) < 0)
		{
			var dom = this.$dom;
			
			if (!dom)
			{
				dom = this.$dom = this.render();
				dom.classList.add('yx-floatlayer');
			}

			style = dom.style;
			style.left = x > 0 ? x + 'px' : x;
			style.top = y > 0 ? y + 'px' : y;
			
			document.body.appendChild(dom);
			
			stack.push(this);
		}
	}
	
	
	
	this.close = function () {
		
		var layer = stack.pop(),
			parent,
			dom;
		
		if (layer && (dom = this.$dom) && (parent = dom.parentNode))
		{
			parent.removeChild(dom);
		}
	}

	
	
}).register('FloatLayer');
