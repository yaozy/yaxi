yaxi.NumberBox.renderer(function (renderer, base) {



    yaxi.template(this, '<span class="$class">'
            + '<input type="number" />'
            + '<span class="yx-number-minus">-</span>'
            + '<span class="yx-number-plus">＋</span>'
        + '</span>');



    this.clear = function () {

        var view;

        if (view = this.$view)
        {
            view.firstChild.value = '';
        }

        this.$storage.value = 0;
    }



    renderer.button = function (view, value) {

        if (value)
        {
            view.setAttribute('button', true);
        }
        else
        {
            view.removeAttribute('button');
        }
    }



    renderer.value = function (view, value) {

        var format = this.__format;

        if (format)
        {
            value = format(value);
        }

        view = view.firstChild;
        view.value = value ? value : (view.value ? 0 : '');

        view = view.nextSibling;

        if (value === this.min)
        {
            view.setAttribute('disabled', true);
        }
        else
        {
            view.removeAttribute('disabled');
        }

        view = view.nextSibling;

        if (value === this.max)
        {
            view.setAttribute('disabled', true);
        }
        else
        {
            view.removeAttribute('disabled');
        }
    }


    this.__on_tap = function (event) {

        var view = this.$view,
            target = event.view,
            keys;

        while (target && target !== view)
        {
            if (keys = target.classList)
            {
                if (keys.contains('yx-number-minus'))
                {
                    change(this, (+view.firstChild.value || 0) - this.step);

                    event.stop();
                    return false;
                }
                
                if (keys.contains('yx-number-plus'))
                {
                    change(this, (+view.firstChild.value || 0) + this.step);

                    event.stop();
                    return false;
                }
            }

            target = target.parentNode;
        }
    }



    function change(control, value) {

        var any;

        any = control.value;
        control.value = value;

        if ((value = control.value) !== any)
        {
            control.$push(value);

            any = new yaxi.Event('change');
            any.view = control.$view.firstChild;
            any.value = value;

            return control.trigger(any);
        }
        else
        {
            control.$renderer.value(control.$view, value);
        }
    }



    this.__on_input = function (event) {

        var maxlength = this.maxlength;

        // 增加input type="number"不支持maxlength的问题
        if (maxlength > 0 && event.target.value.length >= maxlength)
        {
            return false;
        }
    }


    this.__on_change = function (event) {

        var value = this.value;

        this.value = +event.target.value || 0;

        if (this.value !== value)
        {
            this.$push(this.value);
        }
        else
        {
            this.$renderer.value(this.$view, value);
        }
    }




});
