yaxi.Control.renderer(function () {



    var own = Object.getOwnPropertyNames;

    var create = Object.create;

    var div = document.createElement('div');


    // 颜色转换函数, 把@color颜色变量转换成实际的颜色
    var convertColor = function (translateFn, value) {

        return value ? ('' + value).replace(this, translateFn) : '';

    }.bind(/@([\w-]+)/g, function (_, key) {

        return this[key];

    }.bind(yaxi.color));

    

    

    yaxi.template = function (target, html) {

        if (target && html)
        {
            target.__html_template = html;
            target.__dom_template = null;
        }
    }



    this.__html_template = '<div class="$class"></div>';
    


    function init_template(target, control) {

        div.innerHTML = target.__html_template.replace('$class', control.$class);

        view = div.firstChild;
        div.removeChild(view);

        return control.constructor.__dom_template = view;
    }




    // 渲染控件
    this.render = function (control) {

        var view = control.$view || (control.$view = (control.constructor.__dom_template || init_template(this, control)).cloneNode(true));

        view.id = control.uuid;
        this.patch(control, view);

        return view;
    }


    // 全新渲染子控件(给子类用)
    this.renderChildren = function (view, children) {

        var index = 0;
        var control;

        while (control = children[index++])
        {
            view.appendChild(control.$view || control.$renderer.render(control));
        }
    }



    this.patch = function (control, view) {

        var values;

        control.__dirty = false;

        if (values = control.__changes)
        {
            var properties = control.$properties;
            var storage = control.$storage;
            var names = own(values);
            var index = 0;
            var classes, property, name, value, any;

            while (name = names[index++])
            {
                property = properties[name];
                value = storage[name] = values[name];

                switch (property && property.kind)
                {
                    case 'style': // 样式属性
                        // 处理颜色值
                        if (any = this[name])
                        {
                            value = any.call(this, control, view, value);

                            if (value == null)
                            {
                                break;
                            }
                        }
                        else if ((property.data) & 2 === 2)
                        {
                            value = convertColor(value);
                        }

                        view.style[name] = value;
                        break;

                    case 'class': // class属性
                        if (any = this[name])
                        {
                            value = any.call(this, control, view, value);

                            if (value == null)
                            {
                                break;
                            }
                        }
                        else if (value)
                        {
                            any = property.data;
                            value = property.type !== 'boolean' ? any + value.replace(/\s+/g, ' ' + any) : any;
                        }
                        else
                        {
                            value = '';
                        }

                        (classes || (classes = control.__classes || (control.__classes = create(null))))[name] = value;
                        break;

                    default:
                        if (any = this[name])
                        {
                            any.call(this, control, view, values[name]);
                        }
                        break;
                }
            }

            // 有变化的class则合并处理
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

                view.className = control.$class + ' ' + values.join(' ');
            }

            control.__changes = null;
        }
    }



    // 子控件变化补丁(给子类用)
    this.patchChildren = function (control, view, children) {

        var control, last, any;

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
                // 先清空原控件
                view.textContent = '';

                this.renderChildren(view, children);
            }
            else
            {
                patchChildren(view, children);
            }
        }
        else if ((any = children.length) > 0)
        {
            for (var i = 0; i < any; i++)
            {
                if ((control = children[i]) && control.__dirty && (view = control.$view))
                {
                    control.$renderer.patch(control, view);
                }
            }
        }
    }


    function patchChildren(view, children) {

        var refChild = view.firstChild;
        var index = 0;
        var control;
        var newChild;

        while (control = children[index++])
        {
            if (newChild = control.$view)
            {
                if (control.__dirty)
                {
                    control.$renderer.patch(control, newChild);
                }

                if (newChild !== refChild)
                {
                    view.insertBefore(newChild, refChild);
                }
                else
                {
                    refChild = refChild.nextSibling;
                }
            }
            else
            {
                view.insertBefore(control.$renderer.render(control), refChild);
            }
        }

        while (refChild)
        {
            newChild = refChild;
            refChild = refChild.nextSibling;

            view.removeChild(newChild);
        }
    }




    this.hidden = function (control, view, value) {

        view.style.display = value ? 'none' : '';
    }


    this.disabled = function (control, view, value) {

        if (value)
        {
            view.setAttribute('disabled', 'disabled');
        }
        else
        {
            view.removeAttribute('disabled');
        }
    }


    
});

