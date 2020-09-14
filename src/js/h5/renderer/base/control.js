yaxi.Control.mixin(function (mixin) {



    var assign = Object.assign;

    var div = document.createElement('div');


    

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

