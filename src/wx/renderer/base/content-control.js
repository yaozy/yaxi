yaxi.ContentControl.mixin(function (mixin, base) {



    mixin.$type = 'Button';



    function renderContent(self, content) {

        if (typeof content === 'string')
        {
            return [{
                t: 'Text',
                u: self.__uuid,
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


    this.render = function () {

        var view = base.render.call(this);
        var content = this.__content;

        if (content == null)
        {
            content = this.__no_content;
        }

        if (content)
        {
            view.content = renderContent(this, content);
        }
        else
        {
            delete view.content;
        }
        
        return view;
    }


    this.patch = function (view, prefix) {

        var content;

        base.patch.call(this, view, prefix);

        if (content = this.__content || '')
        {
            view.content = renderContent(this, content);
        }
        else
        {
            delete view.content;
        }
    }



});
