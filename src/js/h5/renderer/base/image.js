yaxi.Image.mixin(function (mixin, base) {



    yaxi.template(this, '<image class="$class"></image>');



    mixin.src = function (view, value) {

        view.src = value;
    }



});
