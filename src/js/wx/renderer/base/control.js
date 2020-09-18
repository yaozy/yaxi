yaxi.Control.mixin(function (mixin, base, yaxi) {



    var create = Object.create;


    // 此方法不会复制原型上的成员
    var assign = Object.assign;


    var own = Object.getOwnPropertyNames; 




    function renderStyle(style) {

        var list = [];
        var names = own(style);
        var index = 0;
        var name, value;

        while (name = names[index++])
        {
            if (value = style[name])
            {
                list.push(name, ':', value.replace(/rem/g, 'rpx'), ';');
            }
        }

        return list.join('');
    }


    // 全局渲染
    this.render = function () {

        var mixin = this.$mixin;
        var storage = this.$storage;
        var converts = this.$converts;
        var view = create(null);
        var index = 0;
        var names, name, value, fn;

        this.__dirty = false;

        view.t = this.typeName;
        view.u = this.uuid;

        if (this.__class_dirty)
        {
            this.__class_dirty = false;
            this.__render_class(view, '');
        }

        if (value = this.__style)
        {
            view.s = renderStyle(value);
            this.__style = null;
        }

        if (value = this.__changes)
        {
            assign(storage, value);
            this.__changes = null;
        }

        names = own(storage);

        while (name = names[index++])
        {
            // 配置了处理变更的属性才处理
            if ((value = converts[name]) && value.change)
            {
                if (fn = mixin[name])
                {
                    fn.call(this, view, '', storage[name]);
                }
                else if (fn !== false) // 自定义渲染为false不做任何处理
                {
                    view[name] = storage[name];
                }
            }
        }

        mixin.onrender.call(this, view, '');

        return view;
    }


    // 全新渲染子控件(给子类用)
    this.renderChildren = function (children) {

        var length = children.length;
        
        if (length > 0)
        {
            var list = new Array(length);

            for (var i = 0; i < length; i++)
            {
                list[i] = children[i].render();
            }
            
            return list;
        }

        return [];
    }



    // 增量渲染
    this.patch = function (view, prefix) {

        var changes;

        this.__dirty = false;

        prefix += '.';

        if (this.__class_dirty)
        {
            this.__class_dirty = false;
            this.__render_class(view, prefix);
        }

        if (value = this.__style)
        {
            view.s = renderStyle(value);
            this.__style = null;
        }

        if (changes = this.__changes)
        {
            var storage = this.$storage;
            var mixin = this.$mixin;
            var names = own(changes);
            var index = 0;
            var name, value, fn;

            while (name = names[index++])
            {
                value = storage[name] = changes[name];

                if (fn = mixin[name])
                {
                    fn.call(this, view, prefix, value);
                }
                else if (fn !== false) // 自定义渲染为false不做任何处理
                {
                    view[prefix + name] = value;
                }
            }

            mixin.onrender.call(this, view, prefix);
            
            this.__changes = null;
        }
    }


    // 子控件变化补丁(给子类用)
    this.patchChildren = function (view, prefix, children) {

        var last, any;

        if (last = children.__last)
        {
            children.__last = null;

            if (any = last.length > 0)
            {
                this.destroyChildren(last);
            }

            // 曾经清除过
            if (!any || last.clear)
            {
                view[prefix + 'c'] = this.renderChildren(children);
            }
            else if (children.length < last.length)
            {
                patchRemoved(children, view, prefix);
            }
            else
            {
                patchChanged(children, last, view, prefix);
            }
        }
        else
        {
            patchUnchanged(children, view, prefix);
        }
    }


    function patchUnchanged(children, view, prefix) {

        var item;

        prefix += '.c[';

        for (var i = 0, l = children.length; i < l; i++)
        {
            if ((item = children[i]) && item.__dirty)
            {
                item.patch(view, prefix + i + ']');
            }
        }
    }


    function patchRemoved(children, view, prefix) {

        var length = children.length;
        var list = new Array(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = children[i].render();
        }

        view[prefix + '.c'] = view.children = list;
    }


    function patchChanged(children, last, view, prefix) {

        var length = children.length;
        var item;

        prefix += '.c[';

        for (var i = 0; i < length; i++)
        {
            if ((item = children[i]) !== last[i])
            {
                view[prefix + i + ']'] = item.render();
            }
            else if (item.__dirty)
            {
                item.patch(view, prefix + i + ']');
            }
        }
    }




    this.__render_class = function (view, prefix) {

        var class1 = this.__class_list;
        var class2 = this.__class_data;

        class1 = class1 ? ' ' + class1.join(' ') : '';
        class2 = class2 ? ' ' + class2.join(' ') : '';

        view[prefix + 'class'] = class1 + class2 + (this.__active ? ' active' : '');
    }




    // mixin.style = function (view, prefix, value) {

    //     // 把默认的rem改成rpx, 系统规定1rem = 1rpx
    //     view[prefix + 'style'] = value ? value.replace(/rem/g, 'rpx') : '';
    // }



    mixin.onrender = function (view, prefix) {
    }

    

});
