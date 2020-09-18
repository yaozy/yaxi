yaxi.ContentControl.mixin(function (mixin, base) {



    this.__no_content = '';



    this.render = function () {

        var view = base.render.call(this);
        var content = this.__init_content() || this.__no_content;

        this.__render_content(view, content);

        return view;
    }

    
    this.__render_content = function (view, content) {

        if (typeof content === 'string')
        {
            this.__render_text(view, content);
        }
        else
        {
            view.textContent = '';
            this.renderChildren(view, content);
        }
    }


    this.__render_text = function (view, text) {

        view.textContent = text;
    }


    mixin.content = function (view) {

        this.__render_content(view, this.__init_content());
    }



});
