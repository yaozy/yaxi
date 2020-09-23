yaxi.Control.mixin(function (mixin, base, yaxi) {



    var create = Object.create;

    var assign = Object.assign;

    var own = Object.getOwnPropertyNames; 



    // 颜色转换函数, 把@color颜色变量转换成实际的颜色
    var convertColor = function (translateFn, value) {

        return value ? ('' + value).replace(this, translateFn) : '';

    }.bind(/@([\w-]+)/g, function (_, key) {

        return this[key];

    }.bind(yaxi.color));


    // 单位转换函数, 把rem转换成rpx
    var convertUnit = function (value) {

        return value.replace(this, 'rpx');

    }.bind(/rem/g);

    


    function render(control, view, prefix, values) {
        
        var properties = control.$properties;
        var mixin = control.$mixin;
        var names = own(values);
        var index = 0;
        var classes, styles, property, name, value, any;

        while (name = names[index++])
        {
            property = properties[name];
            value = values[name];

            switch (property && property.kind)
            {
                case 'style': // 样式属性
                    switch (property.data)
                    {
                        case 1: // 处理单位值
                            value = convertUnit(value);
                            break;

                        case 2: // 处理颜色值
                            value = convertColor(value);
                            break;

                        case 3: // 处理单位及颜色值
                            value = convertUnit(convertColor(value));
                            break;
                    }

                    (styles || (styles = control.__styles || (control.__styles = create(null))))[name] = value;
                    break;

                case 'class': // class属性
                    if (any = property.data)
                    {
                        if (property.type !== 'boolean')
                        {
                            value = any + value.replace(/\s+/g, ' ' + any);
                        }
                    }
                    else
                    {
                        value = '';
                    }

                    (classes || (classes = control.__classes || (control.__classes = create(null))))[name] = value;
                    break;

                default:
                    if (property.change) // 配置了处理变更的属性才处理
                    {
                        if (any = mixin[name])
                        {
                            any.call(control, view, prefix, value);
                        }
                        else if (any !== false) // 自定义渲染为false不做任何处理
                        {
                            view[prefix + name] = value;
                        }
                    }
                    break;
            }
        }

        if (classes)
        {
            values = [];

            for (name in classes)
            {
                if (value = classes[name])
                {
                    values.push(value);
                }
            }

            view[prefix + 'class'] = ' ' + values.join(' ');
        }

        if (styles)
        {
            values = [];

            for (name in styles)
            {
                if (value = styles[name])
                {
                    values.push(name, ':', value, ';');
                }
            }

            view[prefix + 's'] = values.join('');
        }
    }



    // 全局渲染
    this.render = function () {

        var storage = this.$storage;
        var view = create(null);
        var changes;

        this.__dirty = false;

        view.t = this.typeName;
        view.u = this.uuid;

        if (changes = this.__changes)
        {
            assign(storage, changes);
            this.__changes = null;
        }

        render(this, view, '', storage);

        this.$mixin.onchange.call(this, view, '');
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

        if (changes = this.__changes)
        {
            assign(this.$storage, changes);
            render(this, view, prefix += '.', changes);
            
            this.$mixin.onchange.call(this, view, prefix);
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



    mixin.onchange = function (view, prefix) {
    }

    

});
