yaxi.Text.renderer(function (renderer, base) {



    yaxi.template(this, '<span class="$class"></span>');

    

    renderer.text = function (view, value) {

        var format;

        if (!this.__security)
        {
            view.textContent = (format = this.__format) ? format(value) : value;
        }
    }


    renderer.security = function (view, value) {

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
