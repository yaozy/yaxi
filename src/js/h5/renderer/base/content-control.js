yaxi.ContentControl.mixin(function (mixin, base) {



    this.__no_content = '';



    this.render = function () {

        var view = base.render.call(this);
        var content = this.__content;

        if (content == null)
        {
            content = this.__no_content;
        }

        this.__render_content(view, content);

        return view;
    }


    
    this.__render_content = function (view, content) {

        this.__content_dirty = false;

        if (typeof content === 'string')
        {
            this.__render_text(view, content);
        }
        else
        {
            var index = 0;
            var control;

            while (control = content[index++])
            {
                view.appendChild(control.render());
            }
        }
    }


    this.__render_text = function (view, text) {

        view.textContent = text;
    }


    mixin.content = function (view, value) {

        this.__render_content(view, this.__content || '');
    }


});
