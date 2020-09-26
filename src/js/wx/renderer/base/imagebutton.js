yaxi.ImageButton.renderer(function (base) {



    this.size = function (control, view, prefix, value) {

        view[prefix + 'size'] = value ? value.replace('rem', 'rpx') : '';
    }



});
