yaxi.Box.extend('StackBox', function (Class, base) {



    // 过渡动画时长(毫秒), 0表示没有过渡动画
    this.$('duration', 5000, {

        change: false,

        convert: function (value) {

            return (value |= 0) < 0 ? 0 : value;
        }
    });


    // 过渡动画类型
    this.$('easingfn', '', false);



    // 扩展切换容器接口
    yaxi.impl.switchbox.call(this);

    


}, function StackBox() {


    this.__indexes = [0, 0, 0];
    yaxi.Box.apply(this, arguments);


});
