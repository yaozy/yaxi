yaxi.Control.renderer(function (renderer) {



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
        }
    }



    this.__html_template = '<div class="$class"></div>';
    


    function init_template(target) {

        div.innerHTML = target.__html_template.replace('$class', target.$class);

        view = div.firstChild;
        div.removeChild(view);

        return target.constructor.__dom_template = view;
    }




    // 渲染控件
    this.render = function () {

        var view = this.$view || (this.$view = (this.constructor.__dom_template || init_template(this)).cloneNode(true));

        view.id = this.uuid;
        this.patch(view);

        return view;
    }


    // 全新渲染子控件(给子类用)
    this.renderChildren = function (view, children) {

        var index = 0;
        var control;

        while (control = children[index++])
        {
            view.appendChild(control.$view || control.render());
        }
    }



    this.patch = function (view) {

        var values;

        this.__dirty = false;

        if (values = this.__changes)
        {
            var properties = this.$properties;
            var storage = this.$storage;
            var renderer = this.$renderer;
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
                        if (any = renderer[name])
                        {
                            value = any.call(this, view, value);

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
                        if (any = renderer[name])
                        {
                            value = any.call(this, view, value);

                            if (value == null)
                            {
                                break;
                            }
                        }
                        else if (any = property.data)
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

                        (classes || (classes = this.__classes = create(null)))[name] = value;
                        break;

                    default:
                        if (any = renderer[name])
                        {
                            any.call(this, view, values[name]);
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

                view.className = this.$class + ' ' + values.join(' ');
            }

            this.__changes = null;
        }
    }



    // 子控件变化补丁(给子类用)
    this.patchChildren = function (view, children) {

        var control, last, any;

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
                    control.patch(view);
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
                    control.patch(newChild);
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
                view.insertBefore(control.render(), refChild);
            }
        }

        while (refChild)
        {
            newChild = refChild;
            refChild = refChild.nextSibling;

            view.removeChild(newChild);
        }
    }




    renderer.hidden = function (view, value) {

        view.style.display = value ? 'none' : '';
    }


    renderer.disabled = function (view, value) {

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

