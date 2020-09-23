yaxi.DataBox.renderer(function (renderer, base) {



    this.render = function () {

        var view = base.render.call(this);
        var children = this.__children;

        children.__last = null;
        view.c = this.renderChildren(children);

        return view;
    }


    this.patch = function (view, prefix) {

        this.patchChildren(view, prefix, this.__children);
        base.patch.call(this, view, prefix);
    }



});