yaxi.Box.extend('StackBox', function (Class, base) {



    // 动画时长
    this.$('duration', 500);


    // 扩展切换容器接口
    yaxi.impl.switchbox.call(this);



}, function StackBox() {


    yaxi.Box.apply(this, arguments);


});
