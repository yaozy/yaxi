yaxi.IconButton.mixin(function (mixin, base) {



    mixin.$type = '';



    mixin.icon = function (view, prefix, value) {

        view[prefix + 'icon'] = value;
    }


    mixin.size = function (view, prefix, value) {

        view[prefix + 'size'] = value;
    }



});
