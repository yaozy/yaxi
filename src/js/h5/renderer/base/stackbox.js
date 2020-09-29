yaxi.StackBox.renderer(function (base) {



    
    yaxi.template(this, '<div class="@class"><div class="yx-stackbox-body"></div></div>');



    this.getChildrenView = function (view) {

        return view.firstChild;
    }



    this.full = function (control, view, value) {

        view.firstChild.className = 'yx-stackbox-body' + (value ? ' yx-stackbox-full' : '');
    }


});
