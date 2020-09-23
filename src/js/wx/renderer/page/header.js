yaxi.Header.renderer(function (base) {



    this.onchange = function (control, view, prefix) {

        view[prefix + 'back'] = yaxi.currentPages.length > 1;
    }



});
