yaxi.Tab.mixin(function (mixin, base) {



    yaxi.template(this, '<div class="$class yx-tab-bottom"></div>');



    mixin.line = function (view, value) {

        this.__change_class(view, 'yx-tab-', value);
    }


});
