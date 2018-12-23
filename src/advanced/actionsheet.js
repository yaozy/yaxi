yaxi.Control.extend(function (Class, base) {



    var stack = yaxi.__layer_stack;



    Class['en-US'] = 'Cancel';


    Class['zh-CN'] = '取消';


    Class['zh-TW'] = '取消';

    


	yaxi.template(this, '<div class="yx-control yx-actionsheet"></div>');




	// header
	this.header = null;


	// 页体
	this.content = null;


	// 取消
	this.cancel = true;



    this.$converter.header = {
        
        fn: function (data) {

            if (data !== false)
            {
                var control;

                if (!data || typeof data !== 'object')
                {
                    data = {
                        Class: yaxi.Text,
                        text: data
                    };
                }

                data.className = 'yx-actionsheet-header ' + (data.className || '');

                control = this.header = new (data.Class || yaxi.Text)();
                control.parent = this;
                control.__init(data);
            }
        }
    };

	
	this.$converter.content = {
        
        fn: function (data) {
		
            if (data)
            {
                var control;

                if (data instanceof Array)
                {
                    data = {
                        Class: yaxi.Panel,
                        children: data
                    }
                }

                data.className = 'yx-actionsheet-content ' + (data.className || '');
                
                control = this.content = new (data.Class || yaxi.Panel)();
                control.parent = this;
                control.__init(data);
                control.on('tap', selected);
            }
        }
	};
	
	
	this.$converter.cancel = {
        
        fn: function (data) {
	
            if (data !== false)
            {
                var control;

                if (!data || typeof data !== 'object')
                {
                    data = {
                        Class: yaxi.Text,
                        text: data
                    };
                }

                data.className = 'yx-actionsheet-cancel ' + (data.className || '');

                control = this.cancel = new (data.Class || yaxi.Text)();
                control.parent = this;
                control.__init(data);
                control.on('tap', close);
            }
        }
	};



    function selected(event) {

        var control = event.target,
            parent;

        while (control && (parent = control.parent))
        {
            if (parent === this)
            {
                this.parent.close(control);
                return;
            }

            control = parent;
        }
    }


    function close() {

        this.parent.close();
    }

	
	
	this.show = function () {
		
        if (stack.indexOf(this) < 0)
        {
            var dom = this.$dom,
                any;
            
            if (!dom)
            {
                dom = this.render();

                if (any = this.header)
                {
                    dom.appendChild(any.$dom || any.render());
                }

                if (any = this.content)
                {
                    dom.appendChild(any.$dom || any.render());
                }

                if (any = this.cancel)
                {
                    dom.appendChild(any.$dom || any.render());
                }
            }

            document.body.appendChild(dom);
            stack.push(this);
        }

        return this;
	}
	
	
	
	this.close = function (selected) {
		
		var parent, dom;

		if (stack[stack.length - 1] === this)
		{
            stack.pop();

            if ((dom = this.$dom) && (parent = dom.parentNode))
            {
                parent.removeChild(dom);
            }

            this.trigger('closed', { selected: selected || this.cancel });
            
            if (this.autoDestroy !== false)
            {
                this.destroy();
            }
		}
    }
    

    this.destroy = function () {

        var control;

        if (control = this.header)
        {
            this.header = null;
            control.destroy();
        }

        if (control = this.content)
        {
            this.content = null;
            control.destroy();
        }

        if (control = this.cancel)
        {
            this.cancel = null;
            control.destroy();
        }

        base.destroy.call(this);
    }



    yaxi.actionsheet = function (data) {

        if (!data || !data.content)
        {
            throw 'actionsheet must input a object and content not allow empty!'
        }

        if (data.cancel === void 0)
        {
            data.cancel = {
                Class: yaxi.Text,
                text: Class[yaxi.language]
            };
        }

        return new Class(data).show();
    }
    

});
