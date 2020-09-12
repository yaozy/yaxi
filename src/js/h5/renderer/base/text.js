yaxi.Text.mixin(function (mixin, base) {



    yaxi.template(this, '<span class="$class"></span>');

    

    mixin.text = function (view, value) {

        var format;

        if (!this.__security)
        {
            view.textContent = (format = this.__format) ? format(value) : value;
        }
    }


    mixin.security = function (view, value) {

        var format;

        if (this.__security = value)
        {
            view.textContent = value;
        }
        else
        {
            view.textContent = (format = this.__format) ? format(this.text) : this.text;
        }
    }



});
