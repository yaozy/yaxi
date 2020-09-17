yaxi.ContentControl.mixin(function (mixin, base) {



    this.__no_content = '';



    this.render = function () {

        var view = base.render.call(this);
        var content = this.__content;

        if (this.__content_dirty)
        {
            if (content)
            {
                if (typeof content === 'object')
                {
                    // 销毁原控件
                    this.destroyChildren(content);
                }
            }
            else if (content == null)
            {
                content = this.__no_content;
            }
            
            this.__render_content(view, content);
        }

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
            view.textContent = '';
            this.renderChildren(view, content);
        }
    }


    this.__render_text = function (view, text) {

        view.textContent = text;
    }



});
