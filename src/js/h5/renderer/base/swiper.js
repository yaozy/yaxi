yaxi.Swiper.renderer(function (base) {



    this.className = 'yx-control yx-box yx-swiper';
    

    this.template('<div class="@class"><div class="yx-swiper-body"></div></div>');



    this.getChildrenView = function (view) {

        return view.firstChild;
    }



    this.current = function (control, value) {

        var style = control.$view.firstChild.style;

        style.transition = 'transform 500ms ease';
        style.transform = 'translateX(-' + value + '00%)';
    }


    this.offset = function (control, value) {

        var style = control.$view.firstChild.style;

        if (value >= 0)
        {
            style.transform = 'translateX(' + value + 'px)';
        }
        else
        {
            style.transition = '';
        }
    }


});
