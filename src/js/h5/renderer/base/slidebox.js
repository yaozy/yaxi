yaxi.SlideBox.renderer(function (base) {



    this.className = 'yx-control yx-box yx-slidebox';
    


    this.template('<div class="@class"><div class="yx-slidebox-body"></div></div>');



    this.getChildrenView = function (view) {

        return view.firstChild;
    }



    this.selectedIndex = function (control, view, value) {

        var duration = control.duration;
        var style = view.firstChild.style;

        style.transition = duration ? 'transform ' + duration + 'ms ease' : '';
        style.transform = 'translateX(-' + value + '00%)';
    }


    this.start = function (control) {

        var view = control.$view.firstChild;

        view.style.transition = '';
        view.className = 'yx-slidebox-body yx-noscroll';
    }

    
    this.slide = function (control, value) {

        control.$view.firstChild.style.transform = 'translateX(' + value + 'px)';
    }


    this.stop = function (control) {

        control.$view.firstChild.className = 'yx-slidebox-body';
    }


});
