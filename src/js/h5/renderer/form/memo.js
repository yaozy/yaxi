yaxi.Memo.renderer(function (base) {



    this.className = 'yx-control yx-memo';
    


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

    

    this.template('<span class="@class"><textarea></textarea></span>');



    this.value = function (control, view, value) {

        view.firstChild.value = value;
    }


    this.placeholder = function (control, view, value) {

        view.firstChild.placeholder = value;
    }



});
