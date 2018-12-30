yaxi.Number = yaxi.TextBox.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-textbox yx-number">'
            + '<input type="number" />'
            + '<span class="yx-number-minus">-</span>'
            + '<span class="yx-number-plus">＋</span>'
        + '</span>');



    // 是否显示button
    this.$property('button', false);


    // 当前值
    this.$property('value', {
    
        defaultValue: 0,
        converter: function (value) {

            var any;

            value = +value || 0;

            if (value < (any = this.min))
            {
                return any;
            }

            if (value > (any = this.max))
            {
                return any;
            }

            return value;
        }
    });


    // 最小值
    this.$property('min', -Infinity, false);


    // 最大值
    this.$property('max', Infinity, false);


    // 加减步进
    this.$property('step', 1);




    var renderer = this.renderer;


    renderer.button = function (dom, value) {

        if (value)
        {
            dom.setAttribute('button', true);
        }
        else
        {
            dom.removeAttribute('button');
        }
    }



    renderer.value = function (dom, value) {

        var format = this.__format;

        if (format)
        {
            value = format(value);
        }

        dom = dom.firstChild;
        dom.value = value ? value : (dom.value ? 0 : '');

        dom = dom.nextSibling;

        if (value === this.min)
        {
            dom.setAttribute('disabled', true);
        }
        else
        {
            dom.removeAttribute('disabled');
        }

        dom = dom.nextSibling;

        if (value === this.max)
        {
            dom.setAttribute('disabled', true);
        }
        else
        {
            dom.removeAttribute('disabled');
        }
    }


    this.__on_tap = function (event) {

        var dom = this.$dom,
            target = event.dom,
            keys;

        while (target && target !== dom)
        {
            if (keys = target.classList)
            {
                if (keys.contains('yx-number-minus'))
                {
                    change(this, (+dom.firstChild.value || 0) - this.step);

                    event.stop();
                    return false;
                }
                
                if (keys.contains('yx-number-plus'))
                {
                    change(this, (+dom.firstChild.value || 0) + this.step);

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

            any = new yaxi.Event();
            any.type = 'change';
            any.dom = control.$dom.firstChild;
            any.value = value;

            return control.trigger(any);
        }
        else
        {
            control.renderer.value(control.$dom, value);
        }
    }



    this.__on_change = function (dom) {

        var value = this.value;

        this.value = +dom.value || 0;

        if (this.value !== value)
        {
            this.$push(this.value);
        }
        else
        {
            this.renderer.value(this.$dom, value);
        }
    }



}).register('Number');
