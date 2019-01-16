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
        
        fn: function (values) {

            if (values !== false)
            {
                var control;

                if (!values || typeof values !== 'object')
                {
                    values = {
                        Class: yaxi.Text,
                        text: values
                    };
                }

                values.className = 'yx-actionsheet-header ' + (values.className || '');

                control = this.header = new (values.Class || yaxi.Text)();
                control.parent = this;
                control.assign(values);
            }
        }
    };

	
	this.$converter.content = {
        
        fn: function (values) {
		
            if (values)
            {
                var control;

                if (values instanceof Array)
                {
                    values = {
                        Class: yaxi.Panel,
                        children: values
                    }
                }

                values.className = 'yx-actionsheet-content ' + (values.className || '');
                
                control = this.content = new (values.Class || yaxi.Panel)();
                control.parent = this;
                control.assign(values);
                control.on('tap', selected);
            }
        }
	};
	
	
	this.$converter.cancel = {
        
        fn: function (values) {
	
            if (values !== false)
            {
                var control;

                if (!values || typeof values !== 'object')
                {
                    values = {
                        Class: yaxi.Text,
                        text: values
                    };
                }

                values.className = 'yx-actionsheet-cancel ' + (values.className || '');

                control = this.cancel = new (values.Class || yaxi.Text)();
                control.parent = this;
                control.assign(values);
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
                header,
                content,
                any;
            
            if (!dom)
            {
                dom = this.render();

                if (header = this.header)
                {
                    dom.appendChild(header.$dom || header.render());
                }

                if (content = this.content)
                {
                    dom.appendChild(any = content.$dom || content.render());

                    if (!header)
                    {
                        any.style.paddingTop = 0;
                    }
                }

                if (any = this.cancel)
                {
                    dom.appendChild(any.$dom || any.render());
                }
            }

            yaxi.__dom_host.appendChild(dom);
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

            var event = new yaxi.Event('closed');

            event.selected = selected;

            this.trigger(event);
            
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

        return new Class().assign(data).show();
    }
    

});
