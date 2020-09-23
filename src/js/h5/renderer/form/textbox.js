yaxi.TextBox.renderer(function (renderer, base) {



    yaxi.template(this, '<input type="text" class="$class" />');




    renderer.focus = function (view, value) {

        if (value)
        {
            view.focus();
        }
        else
        {
            view.blur();
        }
    }


    renderer.value = function (view, value) {

        var format;

        if (format = this.__format)
        {
            value = format(value);
        }

        view.value = value;
    }



    renderer.placeholder = function (view, value) {

        view.setAttribute('placeholder', value);
    }


    renderer.maxlength = function (view, value) {

        view.setAttribute('maxlength', value);
    }


    renderer.pattern = function (view, value) {

        view.setAttribute('pattern', value);
    }


    
    this.__on_change = function (event) {

        var value = this.value;

        this.value = event.target.value;;

        if (this.value !== value)
        {
            this.$push(this.value);
        }
        else
        {
            this.$renderer.value(this.$view, value);
        }
    }



});
