yaxi.Box.renderer(function (renderer, base) {


    
    yaxi.template(this, '<div class="$class"></div>');




    this.render = function () {

        var view = base.render.call(this);
        var children = this.__children;

        children.__last = null;
        this.renderChildren(view, this.children);

        return view;
    }


    
    this.patch = function (view) {

        this.patchChildren(this.getChildrenView(view), this.__children);
        base.patch.call(this, view);
    }


    this.getChildrenView = function (view) {

        return view;
    }



});
