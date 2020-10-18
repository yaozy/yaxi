yaxi.Box.renderer(function (base) {



    this.className = 'yx-control yx-box';
    


    this.render = function (control) {

        var view = base.render.call(this, control);
        var children = control.__children;

        // 清除变更
        children.__last = null;

        this.renderChildren(this.getChildrenView(view), children);

        return view;
    }


    
    this.patch = function (control, view) {

        this.patchChildren(control, this.getChildrenView(view), control.__children);
        base.patch.call(this, control, view);
    }


    this.getChildrenView = function (view) {

        return view;
    }



    this.selectedIndex = this.duration = false;



});
