yaxi.Header.mixin(function (mixin, base) {



    // 默认渲染类型
    mixin.$type = '';



    mixin.onrender = function (view, prefix) {

        var root = this.root;
        view[prefix + 'back'] = root.index && root.index() > 0;
    }



});
