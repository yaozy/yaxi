yaxi.ContentControl.mixin(function (mixin, base) {

    

    this.render = function () {

        var view = base.render.call(this);
        var content = this.__content;

        if (this.__content_dirty)
        {
            if (content == null)
            {
                content = this.__no_content;
            }
            
            view.c = this.__render_content(content);
        }

        return view;
    }
    

    this.patch = function (view, prefix) {

        var content;

        if (this.__content_dirty)
        {
            if ((content = this.__content) && typeof content === 'object')
            {
                // 销毁原控件
                this.destroyChildren(content);
            }

            view[prefix + 'c'] = this.__render_content(this.__content || '');
        }

        base.patch.call(this, view, prefix);
    }


    this.__render_content = function (content) {

        this.__content_dirty = false;

        if (typeof content === 'string')
        {
            return [{
                t: 'Text',
                u: this.uuid,
                text: content
            }];
        }

        return this.renderChildren(content);
    }



});
