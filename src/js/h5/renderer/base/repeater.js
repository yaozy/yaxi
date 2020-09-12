yaxi.Repeater.mixin(function (mixin, base) {



    var panel = yaxi.Panel.prototype;

    

    yaxi.template(this, '<div class="$class"></div>');



    this.render = panel.render;


    this.patch = panel.patch;

    

});
