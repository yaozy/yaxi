yaxi.TextBox.mixin(function (mixin, base) {



    yaxi.template(this, '<span class="$class"><input type="text" /></span>');



    this.focus = function () {

        var view;

        if (view = this.$view)
        {
            view.focus();
        }
    }

    
    this.blur = function () {

        var view;

        if (view = this.$view)
        {
            view.blur();
        }
    }



    mixin.value = function (view, value) {

        var format = this.__format;

        if (format)
        {
            value = format(value);
        }

        view.firstChild.value = value;
    }



    mixin.placeholder = function (view, value) {

        view.firstChild.setAttribute('placeholder', value);
    }


    mixin.maxlength = function (view, value) {

        view.firstChild.setAttribute('maxlength', value);
    }


    mixin.pattern = function (view, value) {

        view.firstChild.setAttribute('pattern', value);
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
