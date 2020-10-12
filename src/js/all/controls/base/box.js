/*
 * Box是一个自由的容器控件
 * 不仅可以通过children属性访问子控件集合, 也可以通过find及query方法对子控件进行处理
*/
yaxi.Control.extend('Box', function (Class, base) {




    // 布局
    this.$('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });

    

    // 子控件集合
    this.$('children', null, {

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


    this.$properties.children = {
        
        convert: function (values) {
      
            if (values && values.length > 0)
            {
                this.__children.load(values);
            }
        }
    };


    this.__load_children = function (values, scope) {

        this.__children.load(values, scope);
    }



    // 扩展查询实现
    yaxi.impl.query.call(this);
    


    // 不支持layout实现, 给子类用
    this.__no_layout = function () {

        this.$('layout', {

            get: nolayout,
            set: nolayout
        });
    
        function nolayout() {
    
            throw new Error('StackBox control doesn\'t supports layout!');
        }
    }



    // 查找关联控件, 给子类(TabBar, StackBox, SlideBox)用
    this.__find_related = function (related) {

        var control;

        if (related)
        {
            if (control = this.root.findByKey(related))
            {
                if (control.$properties.selectedIndex)
                {
                    return control;
                }

                throw new Error('related "' + related + '" has no selectedIndex property!');
            }
        }
        else if (related = this.parent.__children) // 否则在同层找有selectedIndex属性的控件
        {
            for (var i = related.length; i--;)
            {
                if ((control = related[i]) && control.$properties.selectedIndex && control !== this)
                {
                    return control;
                }
            }
        }
    }


    
    this.destroy = function () {

        var children = this.__children;

        for (var i = children.length; i--;)
        {
            children[i].destroy();
        }


        // 清除变更
        children.__last = null;

        base.destroy.call(this);
    }

    

}, function Box() {

    var init;
    
    this.__fields = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);
    
    if (init = this.init)
    {
        init.apply(this, arguments);
    }

});

