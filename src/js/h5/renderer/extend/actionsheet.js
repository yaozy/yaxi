yaxi.Control.extend(function (Class, base) {



    var stack = yaxi.__layer_stack;

    


	yaxi.template(this, '$class"></div>');




	// header
	this.header = null;


	// 页体
	this.content = null;


	// 取消
	this.cancel = true;



    this.$converts.header = {
        
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
                control.load(values);
            }
        }
    };

	
	this.$converts.content = {
        
        fn: function (values) {
		
            if (values)
            {
                var control;

                if (values instanceof Array)
                {
                    values = {
                        Class: yaxi.Box,
                        children: values
                    }
                }

                values.className = 'yx-actionsheet-content ' + (values.className || '');

                control = this.content = new (values.Class || yaxi.Box)();
                control.parent = this;
                control.load(values);
            }
        }
	};
	
	
	this.$converts.cancel = {
        
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
                control.load(values);
            }
        }
	};

	
	
	this.show = function () {
		
        if (stack.indexOf(this) < 0)
        {
            var view = this.$view,
                header,
                content,
                any;
            
            if (!view)
            {
                view = this.render();

                if (header = this.header)
                {
                    view.appendChild(header.$view || header.render());
                }

                if (content = this.content)
                {
                    view.appendChild(any = content.$view || content.render());

                    if (!header)
                    {
                        any.style.paddingTop = 0;
                    }
                }

                if (any = this.cancel)
                {
                    view.appendChild(any.$view || any.render());
                }
            }

            yaxi.__view_host.appendChild(view);
            stack.push(this);
        }

        return this;
	}
    
    
	this.close = function (selected) {
		
		var parent, view;

		if (stack[stack.length - 1] === this)
		{
            stack.pop();

            if ((view = this.$view) && (parent = view.parentNode))
            {
                parent.removeChild(view);
            }

            var event = new yaxi.Event('closed');

            event.selected = selected;

            this.trigger(event);
            this.destroy();
		}
    }



    this.__on_tap = function (event) {

        var content = this.content,
            cancel = this.cancel,
            control = event.target,
            parent;

        while (control && (parent = control.parent))
        {
            if (control === cancel)
            {
                this.close();
                return;
            }

            if (parent === content)
            {
                this.close(control);
                return;
            }

            control = parent;
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
            throw new Error('actionsheet must input a object and content not allow empty!');
        }

        if (data.cancel === void 0)
        {
            data.cancel = {
                Class: yaxi.Text,
                text: yaxi.i18n.Cancel
            };
        }

        return new Class().load(data).show();
    }
    

});
