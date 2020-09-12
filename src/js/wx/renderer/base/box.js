yaxi.Box.mixin(function (mixin, base) {



    this.render = function () {

        var view = base.render.call(this);
        var children = this.__children;
        var length = children.length;
        
        children.__last = null;

        if (length > 0)
        {
            var list = new Array(length);

            for (var i = 0; i < length; i++)
            {
                list[i] = children[i].render();
            }

            view.c = list;
        }
        else
        {
            delete view.c;
        }

        return view;
    }


    this.patch = function (view, prefix) {

        var children = this.__children;
        var last;

        base.patch.call(this, view, prefix);

        if (last = children.__last)
        {
            children.__last = null;

            if (children.length < last.length)
            {
                patchRemoved(children, view, prefix);
            }
            else
            {
                patchChanged(children, last, view, prefix);
            }
        }
        else
        {
            patchUnchanged(children, view, prefix);
        }
    }


    function patchUnchanged(children, view, prefix) {

        var item;

        prefix += '.c[';

        for (var i = 0, l = children.length; i < l; i++)
        {
            if ((item = children[i]) && item.__dirty)
            {
                item.patch(view, prefix + i + ']');
            }
        }
    }


    function patchRemoved(children, view, prefix) {

        var length = children.length;
        var list = new Array(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = children[i].render();
        }

        view[prefix + '.c'] = view.children = list;
    }


    function patchChanged(children, last, view, prefix) {

        var length = children.length;
        var item;

        prefix += '.c[';

        for (var i = 0; i < length; i++)
        {
            if ((item = children[i]) !== last[i])
            {
                view[prefix + i + ']'] = item.render();
            }
            else if (item.__dirty)
            {
                item.patch(view, prefix + i + ']');
            }
        }
    }


});
