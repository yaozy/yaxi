/*
 * Box是一个自由的容器控件
 * 不仅可以通过children属性访问子控件集合, 也可以通过find及query方法对子控件进行处理
*/
yaxi.Box = yaxi.Control.extend(function (Class, base) {



    // 布局
    this.$property('layout', '', {

        class: 'yx-layout-'
    });

    

    // 子控件集合
    this.$property('children', null, {

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


    this.$converts.children = {
        
        fn: function (values) {
      
            if (values && values.length > 0)
            {
                this.__children.assign(values);
            }
        }
    };



    // 扩展查询实现
    yaxi.impl.query.call(this);
    

    
    this.destroy = function () {

        var children = this.__children;

        for (var i = children.length; i--;)
        {
            children[i].destroy();
        }

        base.destroy.call(this);
    }

    

}, function Box() {

    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);
    
    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('Box');

