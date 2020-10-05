yaxi.StackBox.renderer(function (base) {



    this.className = 'yx-control yx-box yx-stackbox';
    

    
    this.template('<div class="@class"><div class="yx-stackbox-body"></div></div>');



    this.getChildrenView = function (view) {

        return view.firstChild;
    }



    this.selectedIndex = function (control, view, value) {

        view.firstChild.style.transform = 'translateX(-' + value + '00%)';
    }



});
