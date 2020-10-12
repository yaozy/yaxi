yaxi.SlideBox.renderer(function (base) {



    this.selectedIndex = function (control, view, prefix, value) {

        var duration;

        if (duration = control.duration)
        {
            duration = 'transform ' + duration + 'ms ease;';
        }

        view[prefix + 'style'] = duration + 'translateX(-' + value + '00%)';
    }


    this.start = function (control) {

        control.$set('noscroll', ' yx-scroll');
    }

    
    this.slide = function (control, value) {

        // control.$set('slide', 'transform:translateX(' + value + 'px)');
    }


    this.stop = function (control) {
    }


});
