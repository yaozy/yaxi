yaxi.Repeater.mixin(function (mixin, base) {



    var box = yaxi.Box.prototype;

    

    yaxi.template(this, '<div class="$class"></div>');



    this.render = box.render;


    this.patch = box.patch;

    

});
