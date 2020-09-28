yaxi.Button.renderer(function (base) {



    function renderContent(control, view) {

        var content = control.__content || '';

        if (typeof content === 'string')
        {
            view.textContent = content;
        }
        else
        {
            view.textContent = '';
            this.renderChildren(view, content);
        }
    }



    this.render = function (control) {

        var view = base.render.call(this, control);

        renderContent.call(this, control, view);
        return view;
    }
    

    this.text = function (control, view) {

        renderContent.call(this, control, view);
    }



});

