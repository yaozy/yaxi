yaxi.Button.renderer(function (base) {



    function renderShadows(control, view) {

        var shadows = control.__shadows || '';

        if (typeof shadows === 'string')
        {
            view.textContent = shadows;
        }
        else
        {
            view.textContent = '';
            this.renderChildren(view, shadows);
        }
    }



    this.render = function (control) {

        var view = base.render.call(this, control);

        renderShadows.call(this, control, view);
        return view;
    }
    

    this.text = function (control, view) {

        renderShadows.call(this, control, view);
    }



});

