yaxi.RadioButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-radiobutton"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-radio-unchecked"></use></svg><span></span></span>');



    this.$property('text', '');


    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-radio-checked');


    this.$property('uncheckedIcon', 'icon-yaxi-radio-unchecked');


    // 互斥容器级别
    this.$property('host', 1);

    


    var renderer = this.renderer;


    renderer.text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    renderer.checked = function (dom, value) {

        dom.firstChild.firstChild.setAttribute('xlink:href', '#' + (value ? this.checkedIcon : this.uncheckedIcon));
    }


    renderer.checkedIcon = function (dom, value) {

        if (value && this.checked)
        {
            dom.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }


    renderer.uncheckedIcon = function (dom, value) {

        if (value && !this.checked)
        {
            dom.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }

    

    this.__on_tap = function () {

        if (!this.checked)
        {
            this.$push(this.checked = true);
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
