yaxi.Header.mixin(function (mixin, base) {



    mixin.onrender = function (view, prefix) {

        var root = this.root;
        view[prefix + 'back'] = root.index && root.index() > 0;
    }



});
