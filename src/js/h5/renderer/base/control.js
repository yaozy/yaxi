yaxi.Control.mixin(function (mixin) {



    var assign = Object.assign;

    var div = document.createElement('div');

    var color = yaxi.color;

    

    yaxi.template = function (target, html) {

        if (target && html)
        {
            target.__html_template = html;
            target.__dom_template = null;
        }
    }



    this.__html_template = '<div class="$class"></div>';
    


    function init_template(target) {

        div.innerHTML = target.__html_template.replace('$class', target.$class);

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

        if (this.__class_dirty)
        {
            this.__class_dirty = false;
            this.__render_class(view);
        }

        if (this.__style_dirty)
        {
            this.__style_dirty = false;
            this.__render_style(view);
        }

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


    this.__render_class = function (view) {

        var class1 = this.__class_list;
        var class2 = this.__class_data;

        class1 = class1 ? ' ' + class1.join(' ') : '';
        class2 = class2 ? ' ' + class2.join(' ') : '';

        view.className = this.$class + class1 + class2;
    }


    this.__render_style = function (view) {

        var style = this.__style;

        if (style && (style = style.join('')))
        {
            // 替换颜色值
            style = style.replace(/@([\w-]+)/g, function (_, key) {

                return color[key];
            });
        }

        view.style.cssText = style || '';
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

