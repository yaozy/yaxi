yaxi.CheckBox.renderer(function (renderer, base) {



    yaxi.template(this, '<span class="$class"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-checkbox-unchecked"></use></svg><span></span></span>');



    renderer.text = function (view, value) {

        view.lastChild.textContent = value;
    }


    renderer.checked = function (view, value) {

        view.firstChild.firstChild.setAttribute('xlink:href', '#' + (value ? this.checkedIcon : this.uncheckedIcon));
    }


    renderer.checkedIcon = function (view, value) {

        if (value && this.checked)
        {
            view.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }


    renderer.uncheckedIcon = function (view, value) {

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
