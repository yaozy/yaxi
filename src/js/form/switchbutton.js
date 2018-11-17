yaxi.SwitchButton = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<span class="yx-control yx-switchbutton"><span class="yx-switchbutton-bar"></span><span class="yx-switchbutton-button"></span></span>');




    this.$property('checked', false);
    



    this.__set_checked = function (dom, value) {

        var classList = dom.classList;

        if (value)
        {
            classList.add('yx-switchbutton-checked');
        }
        else
        {
            classList.remove('yx-switchbutton-checked');
        }
    }



    this.__on_tap = function () {

        this.checked = !this.checked;
        this.trigger('change');
    }



}).register('SwitchButton');
