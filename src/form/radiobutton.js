yaxi.RadioButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-radiobutton"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-radio-unchecked"></use></svg><span></span></span>');



    this.$property('text', '');


    this.$property('fill', '');
    

    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-radio-checked');


    this.$property('uncheckedIcon', 'icon-yaxi-radio-unchecked');


    // 互斥容器级别
    this.$property('host', 1);

    


    this.__set_text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    this.__set_checked = function (dom, value) {

        dom.firstChild.firstChild.setAttribute('xlink:href', '#' + (value ? this.checkedIcon : this.uncheckedIcon));
    }


    this.__set_checkedIcon = function (dom, value) {

        if (value && this.checked)
        {
            dom.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }


    this.__set_uncheckedIcon = function (dom, value) {

        if (value && !this.checked)
        {
            dom.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }

    this.__set_fill = function (dom, value) {

        dom.firstChild.style.fill = value;
    }

    

    this.__on_tap = function () {

        if (!this.checked)
        {
            var binding = this.__binding_push;

            this.checked = true;
    
            if (binding)
            {
                binding.model.$push(this, true);
            }
    
            this.trigger('change');

            // 同一容器内的组件互斥
            this.mutex(this.host)
        }
    }



    this.mutex = function (host) {

        var parent = this.parent;

        host |= 0;

        while (--host)
        {
            parent = parent.parent;
        }

        if (parent)
        {
            var list = parent.query('>>RadioButton');

            for (var i = list.length; i--;)
            {
                var item = list[i];
    
                if (item instanceof Class && item !== this && item.checked)
                {
                    item.checked = false;
                }
            }
        }
    }



}).register('RadioButton');
