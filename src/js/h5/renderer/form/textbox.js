yaxi.TextBox.mixin(function (mixin, base) {



    yaxi.template(this, '<input type="text" class="$class" />');




    mixin.focus = function (view, value) {

        if (value)
        {
            view.focus();
        }
        else
        {
            view.blur();
        }
    }


    mixin.value = function (view, value) {

        var format;

        if (format = this.__format)
        {
            value = format(value);
        }

        view.value = value;
    }



    mixin.placeholder = function (view, value) {

        view.setAttribute('placeholder', value);
    }


    mixin.maxlength = function (view, value) {

        view.setAttribute('maxlength', value);
    }


    mixin.pattern = function (view, value) {

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
            this.$mixin.value(this.$view, value);
        }
    }



});
