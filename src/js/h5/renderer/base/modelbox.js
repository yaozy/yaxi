yaxi.ModelBox.mixin(function (mixin, base) {



    yaxi.template(this, '<div class="$class"></div>');



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
