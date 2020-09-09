yaxi.Repeater.mixin(function (mixin, base) {



    var panel = yaxi.Panel.prototype;



    mixin.$type = 'Panel';

    

    this.render = panel.render;


    this.patch = panel.patch;



});