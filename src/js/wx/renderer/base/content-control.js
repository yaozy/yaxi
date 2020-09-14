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
    
            if (content)
            {
                view.content = this.__render_content(content);
            }
        }
        
        return view;
    }


    this.patch = function (view, prefix) {

        base.patch.call(this, view, prefix);

        if (this.__content_dirty)
        {
            view[prefix + 'content'] = this.__render_content(this.__content || '');
        }
        else
        {
            delete view.content;
        }
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

        var length = content.length;
        var list = new Array(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = content[i].render();
        }
        
        return list;
    }



});
