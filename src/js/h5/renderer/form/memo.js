yaxi.Memo.renderer(function (base) {



    this.focus = function (control) {

        var view;

        if (view = control.$view)
        {
            view.focus();
        }
    }

    
    this.blur = function (control) {

        var view;

        if (view = control.$view)
        {
            view.blur();
        }
    }

    

    yaxi.template(this, '<span class="$class"><textarea></textarea></span>');



    this.value = function (control, view, value) {

        view.firstChild.value = value;
    }


    this.placeholder = function (control, view, value) {

        view.firstChild.placeholder = value;
    }



    this.__on_change = function (event) {

        var value = control.value;

        control.value = event.target.value;

        if (control.value !== value)
        {
            control.$push(control.value);
        }
        else
        {
            this.value(control.$view, value);
        }
    }



});
