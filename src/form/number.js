yaxi.Number = yaxi.TextBox.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-textbox yx-number">'
            + '<input type="number" />'
            + '<span class="yx-number-minus">-</span>'
            + '<span class="yx-number-plus">＋</span>'
        + '</span>');



    // 是否显示button
    this.$property('button', false);


    // 当前值
    this.$property('value', 0);


    // 最小值
    this.$property('min', -Infinity);


    // 最大值
    this.$property('max', Infinity);


    // 加减步进
    this.$property('step', 1);




    this.__set_button = function (dom, value) {

        if (value)
        {
            dom.setAttribute('button', true);
        }
        else
        {
            dom.removeAttribute('button');
        }
    }


    this.__set_min = function (dom, value) {

        dom.setAttribute('min', value);
    }


    this.__set_max = function (dom, value) {

        dom.setAttribute('max', value);
    }


    this.__set_value = function (dom, value) {

        var format = this.__format;

        if (format)
        {
            value = format(value);
        }

        dom = dom.firstChild;
        dom.value = value ? value : (dom.value ? 0 : '');
    }


    this.__on_tap = function (target) {

        var dom = this.$dom,
            any;

        while (target && target !== dom)
        {
            if (any = target.classList)
            {
                if (any.contains('yx-number-minus'))
                {
                    this.value = (+dom.firstChild.value || 0) - this.step;

                    if (any = this.__binding_push)
                    {
                        any.model.$push(this, this.value);
                    }
                    return;
                }
                
                if (any.contains('yx-number-plus'))
                {
                    this.value = (+dom.firstChild.value || 0) + this.step;

                    if (any = this.__binding_push)
                    {
                        any.model.$push(this, this.value);
                    }
                    return;
                }
            }

            target = target.parentNode;
        }
    }


    this.__on_change = function () {

        var binding;

        this.value = +this.$dom.firstChild.value || 0;
        
        if (binding = this.__binding_push)
        {
            binding.model.$push(this, this.value);
        }
    }



}).register('Number');
