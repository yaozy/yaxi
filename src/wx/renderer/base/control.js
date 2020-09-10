yaxi.Control.mixin(function (mixin) {



    var create = Object.create;

    var assign = Object.assign;

    var owner = Object.getOwnPropertyNames; 


    var color = yaxi.color;




    // 全局渲染
    this.render = function () {

        var mixin = this.$mixin;
        var storage = this.$storage;
        var converter = this.$converter;
        var list = this.__wx_class = ['', this.class];
        var view = create(null);
        var value, fn;

        this.__dirty = false;

        view.t = this.typeName;
        view.u = this.uuid;

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
            if ((value = converter[name]) && value.change)
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

        // 叠加处理选中状态
        if (this.selected && (value = this.selectedStatus))
        {
            mixin.onselected.call(this, view, '', true, value);
        }

        // 合并class
        list.dirty = false;
        value = list.join(' ');
        
        if (value === ' ')
        {
            delete view.class;
        }
        else
        {
            view.class = value;
        }

        return view;
    }


    // 增量渲染
    this.patch = function (view, prefix) {

        var changes = this.__changes;

        this.__dirty = false;

        if (changes)
        {
            var storage = this.$storage;
            var mixin = this.$mixin; 
            var value, fn;

            this.__changes = null;

            prefix += '.';
    
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

            // 选中状态变更处理
            if ((value = changes.selected) != null && (changes = this.selectedStatus))
            {
                mixin.onselected.call(this, view, prefix, value, changes);
            }

            // class变更处理
            if ((value = this.__wx_class) && value.dirty)
            {
                value.dirty = false;
                value = value.join(' ');

                view[prefix + 'class'] = value === ' ' ? '' : value;
            }
        }
    }



    this.__change_class = function (prefix, value) {

        var list = this.__wx_class;

        for (var i = list.length; i--;)
        {
            if (list[i].indexOf(prefix) === 0)
            {
                list.dirty = true;

                if (value)
                {
                    list[i] = prefix + value;
                }
                else
                {
                    list.splice(i, 1);
                }

                return;
            }
        }

        if (value)
        {
            list.dirty = true;
            list.push(prefix + value);
        }
    }



    mixin.class = function (view, prefix, value) {

        var list = this.__wx_class;

        list[1] = value;
        list.dirty = true;
    }


    mixin.theme = function (view, prefix, value) {

        this.__change_class('yx-theme-', value);
    }


    mixin.layout = function (view, prefix, value) {

        this.__change_class('yx-layout-', value);
    }



    mixin.style = function (view, prefix, value) {

        // 把默认的rem改成rpx, 系统规定1rem = 1rpx
        if (value.indexOf('rem') > 0)
        {
            value = value.replace(/rem/g, 'rpx');
        }

        view[prefix + 'style'] = value.replace(/@([\w-]+)/g, function (_, key) {

            return color[key];
        });;
    }



    // 不处理selected状态变化(统一处理)
    mixin.selected = false;



    mixin.onrender = function (view, prefix) {
    }


    mixin.onselected = function (view, prefix, selected, status) {

        var mixin = this.$mixin;
        var target = selected ? status : this.$storage;
        var fn;

        for (var name in status)
        {
            if (fn = mixin[name])
            {
                fn.call(this, view, prefix, target[name]);
            }
            else if (fn !== false) // 自定义渲染为false不做任何处理
            {
                view[prefix + name] = target[name];
            }
        }
    }
    

});
