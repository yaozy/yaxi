yaxi.CheckBox = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-checkbox"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-checkbox-unchecked"></use></svg><span></span></span>');




    this.$property('text', '');
    

    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-checkbox-checked');


    this.$property('uncheckedIcon', 'icon-yaxi-checkbox-unchecked');

    


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

        this.$push(this.checked = !this.checked);
        this.trigger('change');
    }



}).register('CheckBox');
