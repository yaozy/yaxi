yaxi.Header.mixin(function (mixin, base) {



    mixin.onchange = function (view, prefix) {

        view[prefix + 'back'] = yaxi.currentPages.length > 1;
    }



});
