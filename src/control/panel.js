yaxi.Panel = yaxi.Control.extend(function (Class, base) {

    
    
    var create = Object.create;

    

    yaxi.template(this, '<div class="yx-control yx-panel"></div>');



    
    Class.ctor = function () {
 
        var init;
        
        this.$storage = create(this.$defaults);
        this.__children = new yaxi.ControlCollection(this);
        
		if (init = this.init)
		{
			init.apply(this, arguments);
		}
    }



    // 子控件集合
    Object.defineProperty(this, 'children', {

        get: function () {

            return this.__children;
        },
        set: function (value) {

            var children = this.__children;

            if (children.length > 0)
            {
                children.clear();
            }

            if (value && value.length > 0)
            {
                children.push.apply(children, value);
            }
        }
    });


    this.$converter.children = {
        
        fn: function (values) {
      
            if (values && values.length > 0)
            {
                this.__children.assign(values);
            }
        }
    };


    // 子控件类型
    this.__child_class = yaxi.Control;




    // 扩展容器功能
    yaxi.container.call(this, base);


    // 扩展下拉刷新功能
    yaxi.__extend_pulldown.call(this);




}).register('Panel');

