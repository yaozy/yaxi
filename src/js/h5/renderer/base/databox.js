yaxi.DataBox.mixin(function (mixin, base) {



    this.render = function () {

        var view = base.render.call(this);
        var children = this.__children;

        children.__last = null;
        this.renderChildren(view, children);

        return view;
    }


    
    this.patch = function (view) {

        this.patchChildren(view, this.__children);
        base.patch.call(this, view);
    }

    

});
