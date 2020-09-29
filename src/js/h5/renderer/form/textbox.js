yaxi.TextBox.renderer(function (base) {



    this.className = 'yx-control yx-textbox';
    


    this.template('<input type="text" class="@class" />');



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


    this.selectionStart = function (control, view, value) {

        view.selectionStart = value;
    }


    this.selectionEnd = function (control, view, value) {

        view.selectionEnd = value;
    }



    this.focus = function (control) {

        control.$view.focus();
    }



});
