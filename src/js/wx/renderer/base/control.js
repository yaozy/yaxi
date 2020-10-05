yaxi.Control.renderer(function (base, yaxi) {



    var create = Object.create;

    var assign = Object.assign;

    var own = Object.getOwnPropertyNames; 


    var replaceUnit = /rem/g;



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

    

    
    function renderChanges(renderer, control, changes, view, prefix) {

        var count;

        changes = control.__get_changes(changes);

        if (count = changes[0])
        {
            renderer.renderClasses(control, changes[1], changes[2], count, view, prefix);
        }

        if (count = changes[3])
        {
            renderer.renderStyles(control,  changes[4], changes[5], count, view, prefix);
        }

        if (count = changes[6])
        {
            renderer.renderAttributes(control,  changes[7], changes[8], count, view, prefix);
        }
    }


    this.renderClasses = function (control, properties, values, count, view, prefix) {

        view[prefix + 'class'] = values.slice(0, count).join('');
    }


    this.renderStyles = function (control, properties, values, count, view, prefix) {

        for (var i = 0; i < count; i++)
        {
            var property = properties[i];
            var value = values[i];

            if ((property.data & 1) === 1)
            {
                value = value.replace(replaceUnit, 'rpx');
            }

            values[i] = property.name + ':' + value + ';';
        }

        view[prefix + 's'] = values.slice(0, count).join('');
    }


    this.renderAttributes = function (control, properties, values, count, view, prefix) {

        var fn, name;

        for (var i = 0; i < count; i++)
        {
            if (fn = this[name = properties[i].name])
            {
                fn.call(this, control, view, prefix, values[i]);
            }
            else if (fn !== false) // 自定义渲染为false不做任何处理
            {
                view[prefix + name] = values[i];
            }
        }
    }



    // 全局渲染
    this.render = function (control) {

        var fields = control.__fields;
        var view = create(null);
        var changes;

        control.__dirty = false;

        view.t = control.typeName;
        view.u = control.uuid;

        if (changes = control.__changes)
        {
            assign(fields, changes);
            control.__changes = null;
        }

        renderChanges(this, control, fields, view, '');

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
            
            return view[prefix + 'c'] = list;
        }
    }



    // 增量渲染
    this.patch = function (control, view, prefix) {

        var changes;

        control.__dirty = false;

        if (changes = control.__changes)
        {
            assign(control.__fields, changes);
            renderChanges(this, control, changes, view, prefix += '.');

            this.onchange.call(this, control, view, prefix);
            control.__changes = null;
        }
    }


    // 子控件变化补丁(给子类用)
    this.patchChildren = function (control, view, prefix, children) {

        var last, any;

        prefix += '.';

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

        prefix += 'c[';

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

        view[prefix + 'c'] = view.children = list;
    }


    function patchChanged(children, last, view, prefix) {

        var length = children.length;
        var item;

        prefix += 'c[';

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
