yaxi.Control.renderer(function () {


    

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


    function renderChanges(renderer, control, changes, view) {

        var count;

        changes = control.__get_changes(changes, control.__fields);

        if (count = changes[0])
        {
            renderer.renderClasses(control, changes[1], changes[2], count, view);
        }

        if (count = changes[3])
        {
            renderer.renderStyles(control,  changes[4], changes[5], count, view);
        }

        if (count = changes[6])
        {
            renderer.renderAttributes(control,  changes[7], changes[8], count, view);
        }
    }


    this.renderClasses = function (control, properties, values, count, view) {

        view.className = this.className + values.slice(0, count).join('');
    }


    this.renderStyles = function (control, properties, values, count, view) {

        var style = view.style;

        for (var i = 0; i < count; i++)
        {
            style[properties[i].name] = values[i];
        }
    }


    this.renderAttributes = function (control, properties, values, count, view) {

        var fn, name;

        for (var i = 0; i < count; i++)
        {
            if (fn = this[name = properties[i].name])
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
        var changes;

        if (!view)
        {
            view = control.$view = createView(this, control);
            view.id = uuid || control.uuid;
        }
        
        control.__dirty = false;

        if (changes = control.__changes)
        {
            renderChanges(this, control, changes, view);
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

        var changes;

        control.__dirty = false;

        if (changes = control.__changes)
        {
            renderChanges(this, control, changes, view);
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


    
});

