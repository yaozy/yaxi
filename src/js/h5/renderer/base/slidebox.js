yaxi.SlideBox.renderer(function (base, thisControl, yaxi) {



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



    this.circular = false;


    this.autoplay = function (control, view, value) {

        control.__do_autoplay(value);
    }




    thisControl.__start = function () {

        var view = this.$view.firstChild;

        view.style.transition = '';
        view.className = 'yx-slidebox-body yx-noscroll';
    }


    thisControl.__move = function (distance) {

        this.$view.firstChild.style.transform = 'translateX(' + distance + 'px)';
    }


    thisControl.__stop = function (change) {

        var view = this.$view;

        if (change)
        {
            this.selectedIndex += change;
        }
        else
        {
            this.$renderer.selectedIndex(this, view, this.selectedIndex);
        }

        view.firstChild.className = 'yx-slidebox-body';
    }


});
