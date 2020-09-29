yaxi.Text.renderer(function (base) {



    this.className = 'yx-control yx-text';
    


    this.template('<span class="@class"></span>');

    

    this.text = function (control, view, value) {

        var format;

        if (!control.__security)
        {
            view.textContent = (format = control.__format) ? format(value) : value;
        }
    }


    this.security = function (control, view, value) {

        var format;

        if (control.__security = value)
        {
            view.textContent = value;
        }
        else
        {
            view.textContent = (format = control.__format) ? format(control.text) : control.text;
        }
    }



});
