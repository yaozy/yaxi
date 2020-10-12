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




// 单页切换控件接口
yaxi.impl.switchbox = function () {



    // 不支持layout属性
    this.$('layout', {

        get: nolayout,
        set: nolayout
    });

    function nolayout() {

        throw new Error('StackBox control doesn\'t supports layout!');
    }



    // 获取或设置当前页索引
    this.$('selectedIndex', 0, {

        force: true,
        alias: 'selected-index',

        convert: function (value) {

            return (value |= 0) < 0 ? 0 : value;
        }
    });



    // 选中的页头
    this.$('selectedItem', null, {

        get: function () {

            var index = this.selectedIndex | 0;
            return index >= 0 && this.__children[index] || null;
        }
    });



    this.__load_children = function (values, scope) {

        this.__children.load(values, scope);
        this.__switch(this, this.selectedIndex, -1);
    }


    this.__set_selectedIndex = function (value, oldValue) {

        if (this.__children[value])
        {
            this.__switch(this, value, oldValue); 

            // change事件不冒泡
            this.trigger('change', value, false);
        }
    }


    this.__switch = function (switchbox, index, oldIndex) {

        var children = switchbox.__children;
        var control;

        if (control = oldIndex >= 0 && children[oldIndex])
        {
            control.onhide && control.onhide();
        }
    
        if (control = children[index])
        {
            if (!control.__shown)
            {
                control.__shown = true;
                control.onload && control.onload();
            }

            control.onshow && control.onshow();
        }
    }


}

