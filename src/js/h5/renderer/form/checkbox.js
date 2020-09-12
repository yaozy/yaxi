yaxi.CheckBox.mixin(function (mixin, base) {



    yaxi.template(this, '<span class="$class"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-checkbox-unchecked"></use></svg><span></span></span>');



    mixin.text = function (view, value) {

        view.lastChild.textContent = value;
    }


    mixin.checked = function (view, value) {

        view.firstChild.firstChild.setAttribute('xlink:href', '#' + (value ? this.checkedIcon : this.uncheckedIcon));
    }


    mixin.checkedIcon = function (view, value) {

        if (value && this.checked)
        {
            view.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }


    mixin.uncheckedIcon = function (view, value) {

        if (value && !this.checked)
        {
            view.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }



    this.__on_tap = function () {

        this.$push(this.checked = !this.checked);
        this.trigger('change');
    }



});
