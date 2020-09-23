yaxi.TextBox.renderer(function (base) {



    yaxi.template(this, '<input type="text" class="$class" />');




    this.focus = function (control, view, value) {

        if (value)
        {
            view.focus();
        }
        else
        {
            view.blur();
        }
    }


    this.value = function (control, view, value) {

        var format;

        if (format = control.__format)
        {
            value = format(value);
        }

        view.value = value;
    }



    this.placeholder = function (control, view, value) {

        view.setAttribute('placeholder', value);
    }


    this.maxlength = function (control, view, value) {

        view.setAttribute('maxlength', value);
    }


    this.pattern = function (control, view, value) {

        view.setAttribute('pattern', value);
    }


    
    this.__on_change = function (event) {

        
    }



});
