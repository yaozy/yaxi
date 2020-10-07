yaxi.ScrollBox.renderer(function (base) {




    this.className = 'yx-control yx-box yx-scrollbox';




    this.scrollTop = function (control) {

        return control.$view.scrollTop;
    }


    this.scrollHeight = function (control) {

        return control.$view.scrollHeight;
    }


    this.maxTop = function (control) {

        var view = control.$view;
        return view.scrollHeight - view.offsetHeight;
    }



});
