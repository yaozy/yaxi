yaxi.SwitchButton.mixin(function (mixin, base) {



    yaxi.template(this, '<span class="$class"><span class="yx-switchbutton-bar"></span><span class="yx-switchbutton-button"></span></span>');



    mixin.checked = function (view, value) {

        var classList = view.classList;

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

        this.$push(this.checked = !this.checked);
        this.trigger('change');
    }



});
