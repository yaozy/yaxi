yaxi.Header.mixin(function (mixin, base) {



    mixin.onrender = function (view, prefix) {

        view[prefix + 'back'] = yaxi.currentPages.length > 1;
    }



});
