yaxi.CheckBox.renderer(function (base) {



    yaxi.template(this, '<span class="$class"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-checkbox-unchecked"></use></svg><span></span></span>');



    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }


    this.checked = function (control, view, value) {

        view.firstChild.firstChild.setAttribute('xlink:href', '#' + (value ? this.checkedIcon : this.uncheckedIcon));
    }


    this.checkedIcon = function (control, view, value) {

        if (value && this.checked)
        {
            view.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }


    this.uncheckedIcon = function (control, view, value) {

        if (value && !this.checked)
        {
            view.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }



});
