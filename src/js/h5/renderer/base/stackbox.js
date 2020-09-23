yaxi.StackBox.renderer(function (renderer, base) {



    
    yaxi.template(this, '<div class="$class"><div class="yx-stackbox-body"></div></div>');



    this.getChildrenView = function (view) {

        return view.firstChild;
    }



    renderer.full = function (view, value) {

        view.firstChild.className = 'yx-stackbox-body' + (value ? ' yx-stackbox-full' : '');
    }


});
