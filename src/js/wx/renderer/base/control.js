yaxi.Control.mixin(function (mixin, base, yaxi) {



    var create = Object.create;

    var assign = Object.assign;

    var owner = Object.getOwnPropertyNames; 



    // 正在加载的容器控件的uuid, 容器控件的所有事件都由容器触发, 所在需要把子控件的uuid设置成容器的uuid
    yaxi.__content_uuid = 0;




    // 全局渲染
    this.render = function () {

        var mixin = this.$mixin;
        var storage = this.$storage;
        var converts = this.$converts;
        var view = create(null);
        var value, fn;

        this.__dirty = false;

        view.t = this.typeName;
        view.u = this.uuid;

        if (this.__class_dirty)
        {
            this.__class_dirty = false;
            this.__render_class(view, '');
        }

        if (value = this.__changes)
        {
            this.__changes = null;
            assign(storage, value);
        }

        var names = owner(storage);

        for (var i = 0, l = names.length; i < l; i++)
        {
            var name = names[i];

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

    
        if (changes = this.__changes)
        {
            var storage = this.$storage;
            var mixin = this.$mixin; 
            var value, fn;

            this.__changes = null;

            for (var name in changes)
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
        }
    }




    this.__render_class = function (view, prefix) {

        var class1 = this.__class_list;
        var class2 = this.__class_data;

        class1 = class1 ? ' ' + class1.join(' ') : '';
        class2 = class2 ? ' ' + class2.join(' ') : '';

        view[prefix + 'class'] = class1 + class2 + (this.__active ? ' active' : '');
    }




    mixin.style = function (view, prefix, value) {

        // 把默认的rem改成rpx, 系统规定1rem = 1rpx
        view[prefix + 'style'] = value ? value.replace(/rem/g, 'rpx') : '';
    }



    mixin.onrender = function (view, prefix) {
    }

    

});
