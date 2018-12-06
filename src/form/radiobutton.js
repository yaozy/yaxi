yaxi.RadioButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-radiobutton"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-radio-unchecked"></use></svg><span></span></span>');




    this.$property('text', '');


    this.$property('fill', '');
    

    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-radio-checked');


    this.$property('uncheckedIcon', 'icon-yaxi-radio-unchecked');

    


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

        var binding = this.__binding_push;

        this.checked = !this.checked;

        if (binding)
        {
            binding.model.$push(this, this.checked);
        }

        this.trigger('change');
    }



}).register('RadioButton');
