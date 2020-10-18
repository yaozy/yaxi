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

        var children = this.__children;
        var index = this.selectedIndex;

        children.load(values, scope);
        
        if (children[index])
        {
            this.__set_selectedIndex(index, -1);
        }
    }


    this.__set_selectedIndex = function (value, oldValue) {

        // 坐标变换
        this.__transform(value);

        // 切换页面
        this.__switch(this, value, oldValue); 

        // change事件不冒泡
        this.trigger('change', value, false);
    }



    function transform(children, index, last) {

        var transition = this.duration;
        var circular = this.circular !== false;
        var control, after;

        transition = transition > 0 ? 'transform ' + transition + 'ms ' + (this.easingfn || 'ease') : '';
    
        for (var i = 0; i <= last; i++)
        {
            if (i !== index && (control = children[i]))
            {
                // 显示位置: 默认小于当前页的放前面, 大于当前面的放后面
                after = i < index ? 0 : 1;

                // 如果是第一页
                // if (i === 0)
                // {
                //     // 当前为最后一页且循环显示则把第一页放到后面
                //     if (circular && index === last)
                //     {
                //         // 标记移动过
                //         control.__move = 1;
                //         after = 1;
                //     }
                // }
                // else if (i === last) // 如果是最后一页
                // {
                //     // 当前为第一页且循环显示则把最后一页放到前面
                //     if (circular && index === 0)
                //     {
                //         // 标记移动过
                //         control.__move = 1;
                //         after = 0;
                //     }
                // }

                // 上一页设置过渡效果
                control.transition = i === this.__last ? transition : '';
                control.transform = after ? '' : 'translateX(-100%)';
            }
        }

        changeCurrent(children, index, transition);
    }


    function changeCurrent(children, index, transition) {

        var control;
        
        // 当前页
        if (control = children[index])
        {
            control.__move = 0;
            control.transform = 'translateX(0)';
            control.transition = transition || '';
        }
    }


    // 使用变换对位置进行处理
    this.__transform = function (index) {

        var children = this.__children;
        var last = children.length - 1;

        if (last > 0)
        {
            var style = 'translateX(-100%)';
            var control;

            // 如果最后一页曾经放到前面需要先还原
            if (index !== last && (control = children[last]) && control.__move)
            {
                style = '';
            }
            // 如果第一页曾经放到后面需要先还原
            else if (index !== 0 && (control = children[0]) && control.__move)
            {
                style = 'translateX(0)';
            }
            else
            {
                // 不需要还原变换则直接进行变换处理
                transform.call(this, children, index, last);
                control = 0;
            }

            if (control)
            {
                control.__move = 0;
                control.transition = '';
                control.transform = style;

                // 立即更新补丁
                yaxi.patch.update();

                // 需要还原变换则延时处理
                setTimeout(transform.bind(this, children, index, last), 1000);
            }
        }
        else
        {
            changeCurrent(children, index);
        }

        this.__last = index;
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

