yaxi.Control.renderer(function (base, thisControl) {


    
    var assign = Object.assign;

    var div = document.createElement('div');


    

    this.template = function (html) {

        if (html)
        {
            this.__html_template = html;
            this.__dom_template = null;
        }
    }



    this.__html_template = '<div class="@class"></div>';



    this.className = 'yx-control';
    


    function createView(renderer, control) {

        var Class = control.constructor;
        var dom;

        if (dom = Class.__dom_template)
        {
            return dom.cloneNode(true);
        }

        div.innerHTML = renderer.__html_template.replace('@class', renderer.className);

        dom = div.firstChild;
        div.removeChild(dom);

        return (Class.__dom_template = dom).cloneNode(true);
    }




    this.renderClasses = function (control, properties, values, count, view) {

        view.className = this.className + values.slice(0, count).join('');
    }


    this.renderSplitClasses = function (control, properties, values, count, view) {

        var property, layout;

        for (var i = 0; i < count; i++)
        {
            var property = properties[i];

            if (property.name === 'layout')
            {
                layout = values[i];
                values[i] = '';
                break;
            }
        }

        view.className = this.className + values.slice(0, count).join('');
        return layout || '';
    }


    this.renderStyles = function (control, properties, values, count, view) {

        var style = view.style;

        for (var i = 0; i < count; i++)
        {
            style[properties[i].name] = values[i];
        }
    }


    this.renderSplitStyles = function (control, properties, values, count, view, layoutView) {

        var style1 = view.style;
        var style2 = layoutView.style;
        var property;

        for (var i = 0; i < count; i++)
        {
            property = properties[i];
            (property.layout ? style1 : style2)[properties[i].name] = values[i];
        }
    }


    this.renderAttributes = function (control, properties, values, count, view) {

        var property, fn, name;

        for (var i = 0; i < count; i++)
        {
            property = properties[i];
            name = property.name || property;

            if (fn = this[name])
            {
                fn.call(this, control, view, values[i]);
            }
            else if (fn !== false) // 自定义渲染为false不做任何处理
            {
                view[name] = values[i];
            }
        }
    }



    // 渲染控件
    this.render = function (control, uuid) {

        var view = control.$view;
        var fields, changes, any;

        if (!view)
        {
            view = control.$view = createView(this, control);
            view.id = uuid || control.uuid;

            if (any = control.__on_mount)
            {
                control.__on_mount = null;
                any.call(control, view);
            }
        }
        
        control.__dirty = false;

        if (changes = control.__changes)
        {
            assign(fields = control.__fields, changes);

            changes = control.__get_changes(fields);

            if (any = changes[0])
            {
                this.renderClasses(control, changes[1], changes[2], any, view);
            }

            if (any = changes[3])
            {
                this.renderStyles(control,  changes[4], changes[5], any, view);
            }

            if (any = changes[6])
            {
                this.renderAttributes(control,  changes[7], changes[8], any, view);
            }

            control.__changes = null;
        }

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

        var fields, changes, count;

        control.__dirty = false;

        if (changes = control.__changes)
        {
            assign(fields = control.__fields, changes);

            changes = control.__get_changes(changes);

            if (count = changes[6])
            {
                this.renderAttributes(control,  changes[7], changes[8], count, view);
            }

            // 如果class和样式有变化需要重新渲染
            if (changes[0] > 0 || changes[3] > 0)
            {
                fields = control.__get_changes(fields);

                if (changes[0] > 0 && (count = fields[0]))
                {
                    this.renderClasses(control, fields[1], fields[2], count, view);
                }
        
                if (changes[3] > 0 && (count = fields[3]))
                {
                    this.renderStyles(control,  fields[4], fields[5], count, view);
                }
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
                any = control.destroyChildren(last);
            }

            // 全部为新添加的控件
            if (!any)
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




    
    thisControl.boundingClientRect = function (callbackFn) {

        var view;

        if (callbackFn)
        {
            if (view = this.$view)
            {
                boundingClientRect(view, callbackFn);
            }
            else
            {
                control.__on_mount = function (view) {

                    setTimeout(function () {

                        boundingClientRect(view, callbackFn);

                    }, 0);
                }
            }
        }
    }


    function boundingClientRect(view, callbackFn) {

        var rect = view.getBoundingClientRect();

        callbackFn({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            right: rect.right,
            bottom: rect.bottom
        });
    }

    
});

