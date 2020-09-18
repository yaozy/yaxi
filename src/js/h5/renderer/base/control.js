yaxi.Control.mixin(function (mixin) {



    var own = Object.getOwnPropertyNames;

    var div = document.createElement('div');


    

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

        view.$uuid = this.uuid;

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

        if (this.__class_dirty)
        {
            this.__class_dirty = false;
            this.__render_class(view);
        }

        if (values = this.__style)
        {
            style(view, values);
            this.__style = null;
        }

        if (values = this.__changes)
        {
            var storage = this.$storage;
            var mixin = this.$mixin;
            var names = own(values);
            var index = 0;
            var name, fn;

            while (name = names[index++])
            {
                storage[name] = values[name];

                if (fn = mixin[name])
                {
                    fn.call(this, view, values[name]);
                }
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




    function style(view, style) {

        var names = own(style);
        var index = 0;
        var name;

        while (name = names[index++])
        {
            view.style[name] = style[name];
        }
    }


    this.__render_class = function (view) {

        var class1 = this.__class_list;
        var class2 = this.__class_data;

        class1 = class1 ? ' ' + class1.join(' ') : '';
        class2 = class2 ? ' ' + class2.join(' ') : '';

        view.className = this.$class + class1 + class2 + (this.__active ? ' active' : '');
    }



    mixin.style = function (view, value) {

        view.style.cssText = value;
    }


    mixin.id = function (view, value) {

        view.id = value;
    }


    mixin.disabled = function (view, value) {

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

