yaxi.ContentControl.renderer(function (base) {




    this.render = function (control) {

        var view = base.render.call(this, control);
        var content = control.__init_content() || control.__no_content || '';

        this.renderContent(view, content);

        return view;
    }

    
    this.renderContent = function (view, content) {

        if (typeof content === 'string')
        {
            this.renderText(view, content);
        }
        else
        {
            view.textContent = '';
            this.renderChildren(view, content);
        }
    }


    this.renderText = function (view, text) {

        view.textContent = text;
    }


    this.content = function (control, view) {

        this.renderContent(view, control.__init_content());
    }



});
