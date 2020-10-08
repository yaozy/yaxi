yaxi.Control.renderer(function (base, thisControl) {



    var create = Object.create;

    var assign = Object.assign;


    var replaceUnit = /rem/g;



    
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


    this.renderSplit1 = function (control, properties, values, count, view, prefix) {

        var index = 0;
        var property;

        while (property = properties[index])
        {
            if (property.name === 'layout')
            {
                view[prefix + 'layout'] = values[index];
                values[index] = '';
                break;
            }

            index++;
        }

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

            values[i] = property.alias + ':' + value + ';';
        }

        view[prefix + 's'] = values.slice(0, count).join('');
    }


    this.renderSplit2 = function (control, properties, values, count, view, prefix) {

        var layout = '';

        for (var i = 0; i < count; i++)
        {
            var property = properties[i];
            var value = values[i];

            if ((property.data & 1) === 1)
            {
                value = value.replace(replaceUnit, 'rpx');
            }

            value = property.alias + ':' + value + ';';

            if (property.layout)
            {
                layout += value;
                value = '';
            }

            values[i] = value;
        }

        view[prefix + 's'] = values.slice(0, count).join('');
        view[prefix + 'style'] = layout;
    }



    this.renderAttributes = function (control, properties, values, count, view, prefix) {

        var property, fn, name;

        for (var i = 0; i < count; i++)
        {
            property = properties[i];
            name = property.name || property;

            if (fn = this[name])
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
        var list;
        
        if (length > 0)
        {
            list = new Array(length);

            for (var i = 0; i < length; i++)
            {
                list[i] = children[i].$renderer.render(children[i]);
            }
        }

        view[prefix + 'c'] = list || [];
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
                any = control.destroyChildren(last);
            }

            // 全部为新添加的控件
            if (!any)
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

        view[prefix + 'c'] = list;
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



    
    thisControl.boundingClientRect = function (callback) {

        callback && wx.createSelectorQuery().select('#' + this.uuid).boundingClientRect(function (rect) {

            callback({
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                right: rect.right,
                bottom: rect.bottom
            })

        }).exec();
    }

    

});
