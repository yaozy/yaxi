yaxi.Control.mixin(function (mixin) {



    var assign = Object.assign;

    var div = document.createElement('div');

    var color = yaxi.color;

    

    yaxi.template = function (target, html) {

        if (target && html)
        {
            target.__template = html;
            target.__dom_template = null;
        }
    }



    this.__template = '<div class="$class"></div>';
    


    function init_template(target) {

        div.innerHTML = target.__template.replace('$class', target.$class);

        view = div.firstChild;
        div.removeChild(view);

        return target.constructor.prototype.__dom_template = view;
    }



    // 渲染控件
    this.render = function () {

        var view = this.$view || (this.$view = (this.__dom_template || init_template(this)).cloneNode(true));

        view.$uuid = this.uuid;
        this.patch(view);

        return view;
    }



    this.destroyView = function (view) {
    }



    this.patch = function (view) {

        var changes;

        this.__dirty = false;

        if (changes = this.__changes)
        {
            var storage = this.$storage;
            var mixin = this.$mixin;
            var fn;

            this.__changes = null;

            assign(storage, changes);

            for (var name in changes)
            {
                if (fn = mixin[name])
                {
                    fn.call(this, view, changes[name]);
                }
            }

            return changes;
        }
    }



    this.__render_content = function (view, content) {

        if (typeof content === 'string')
        {
            view.textContent = content;
        }
        else
        {
            var index = 0;
            var control;

            while (control = content[index++])
            {
                view.appendChild(control.render());
            }
        }
    }


    this.__change_class = function (view, prefix, value) {

        var classList = view.classList;

        for (var i = classList.length; i--;)
        {
            if (classList[i].indexOf(prefix) === 0)
            {
                if (value)
                {
                    classList.replace(classList[i], prefix + value);
                }
                else
                {
                    classList.remove(classList[i]);
                }

                return;
            }
        }

        if (value)
        {
            classList.add(prefix + value);
        }
    }



    mixin.theme = function (view, value) {

        this.__change_class(view, 'yx-theme-', value);
    }


    mixin.visible = function (view, value) {

        view.style.display = value ? '' : 'hidden';
    }


    mixin.selected = function (view, value) {

        var status, mixin, changes, fn;

        // 同步状态
        if (status = this.selectedStatus)
        {
            mixin = this.$mixin;
            changes = value ? status : this;

            for (var name in status)
            {
                if (value && name === 'style')
                {
                    view.style.cssText = this.style + changes[name];
                }
                else if (fn = mixin[name])
                {
                    fn.call(this, view, changes[name]);
                }
            }
        }
    }



    mixin.id = function (view, value) {

        view.id = value;
    }


    mixin.class = function (view, value) {

        view.className = value ? this.$class + ' ' + value : this.$class;
    }


    mixin.style = function (view, value) {

        view.style.cssText = value.replace(/@([\w-]+)/g, function (_, key) {

            return color[key];
        });
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

    

    mixin.layout = function (view, value) {

        this.__change_class(view, 'yx-layout-', value);
    }


    
});

