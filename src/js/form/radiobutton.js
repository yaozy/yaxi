yaxi.RadioButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-radiobutton"><svg aria-hidden="true"><use xlink:href="#icon-radio-uncheck"></use></svg><span></span></span>');




    this.$property('text', '');

    this.$property('fill', '');
    
    this.$property('checked', false);

    


    this.__set_text = function (dom, value) {

        dom.lastChild.textContent = value;
    }


    this.__set_checked = function (dom, value) {

        dom.firstChild.firstChild.setAttribute('xlink:href', '#icon-radio-' + (value ? 'checked' : 'uncheck'));
    }


    this.__set_fill = function (dom, value) {

        dom.firstChild.style.fill = value;
    }


    this.__on_tap = function () {

        this.checked = !this.checked;
        this.trigger('change');
    }



}).register('RadioButton');
