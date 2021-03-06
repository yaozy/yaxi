yaxi.DataBox.renderer(function (base) {



    this.className = 'yx-control yx-databox';



    this.render = function (control) {

        var view = base.render.call(this, control);
        var children = control.__children;

        // 清除变更
        children.__last = null;

        this.renderChildren(view, children);

        return view;
    }


    
    this.patch = function (control, view) {

        this.patchChildren(control, view, control.__children);
        base.patch.call(this, control, view);
    }



});
