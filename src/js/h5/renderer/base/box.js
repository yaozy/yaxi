yaxi.Box.renderer(function (base) {


    
    yaxi.template(this, '<div class="$class"></div>');




    this.render = function (control) {

        var view = base.render.call(this, control);
        var children = control.__children;

        children.__last = null;
        this.renderChildren(view, children);

        return view;
    }


    
    this.patch = function (control, view) {

        this.patchChildren(control, this.getChildrenView(view), control.__children);
        base.patch.call(this, control, view);
    }


    this.getChildrenView = function (view) {

        return view;
    }



});
