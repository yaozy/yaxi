yaxi.Control.renderer(function (base, yaxi) {



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

    


    function render(renderer, control, view, prefix, values) {
        
        var properties = control.$properties;
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
                    if (any = renderer[name])
                    {
                        value = any.call(renderer, control, view, prefix, value);

                        if (value == null)
                        {
                            break;
                        }
                    }
                    else
                    {
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
                    }

                    (styles || (styles = control.__styles || (control.__styles = create(null))))[name] = value;
                    break;

                case 'class': // class属性
                    if (any = renderer[name])
                    {
                        value = any.call(renderer, control, view, prefix, value);

                        if (value == null)
                        {
                            break;
                        }
                    }
                    else if (any = property.data)
                    {
                        if (property.type !== 'boolean')
                        {
                            value = value ? any + value.replace(/\s+/g, ' ' + any) : '';
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
                        if (any = renderer[name])
                        {
                            any.call(renderer, control, view, prefix, value);
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
    this.render = function (control) {

        var storage = control.$storage;
        var view = create(null);
        var changes;

        control.__dirty = false;

        view.t = control.typeName;
        view.u = control.uuid;

        if (changes = control.__changes)
        {
            assign(storage, changes);
            control.__changes = null;
        }

        render(this, control, view, '', storage);

        this.onchange.call(this, control, view, '');
        return view;
    }


    // 全新渲染子控件(给子类用)
    this.renderChildren = function (view, prefix, children) {

        var length = children.length;
        
        if (length > 0)
        {
            var list = new Array(length);

            for (var i = 0; i < length; i++)
            {
                list[i] = children[i].$renderer.render(children[i]);
            }
            
            view[prefix + 'c'] = list;
        }
    }



    // 增量渲染
    this.patch = function (control, view, prefix) {

        var changes;

        control.__dirty = false;

        if (changes = control.__changes)
        {
            assign(control.$storage, changes);
            render(this, control, view, prefix += '.', changes);
            
            this.onchange.call(this, control, view, prefix);
            control.__changes = null;
        }
    }


    // 子控件变化补丁(给子类用)
    this.patchChildren = function (control, view, prefix, children) {

        var last, any;

        if (last = children.__last)
        {
            children.__last = null;

            if (any = last.length > 0)
            {
                control.destroyChildren(last);
            }

            // 曾经清除过
            if (!any || last.clear)
            {
                this.renderChildren(view, prefix, children);
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
                item.$renderer.patch(item, view, prefix + i + ']');
            }
        }
    }


    function patchRemoved(children, view, prefix) {

        var length = children.length;
        var list = new Array(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = children[i].$renderer.render(children[i]);
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
                view[prefix + i + ']'] = item.$renderer.render(item);
            }
            else if (item.__dirty)
            {
                item.$renderer.patch(item, view, prefix + i + ']');
            }
        }
    }



    this.onchange = function (control, view, prefix) {
    }

    

});
