yaxi.Box.renderer(function (base) {



    this.render = function (control) {

        var view = base.render.call(this, control);
        var children = control.__children;

        children.__last = null;
        this.renderChildren(view, '', children);

        return view;
    }


    this.patch = function (control, view, prefix) {

        this.patchChildren(control, view, prefix, control.__children);
        base.patch.call(this, control, view, prefix);
    }



});
