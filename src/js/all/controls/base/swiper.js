yaxi.Box.extend('Swiper', function (Class, base) {



    // 是否自动切换
    this.$('autoplay', true, false);


    // 当前所在滑块的 index
    this.$('current', 0);


    // 自动切换时间间隔
    this.$('interval', 5000, false);


    // 滑动动画时长
    this.$('duration', 500, false);



    // 前边距, 可用于露出前一项的一小部分, 接受px和rem值
    this.$('before', '');


    // 后边距, 可用于露出后一项的一小部分, 接受px和rem值
    this.$('after', '');



    this.__on_change = function (value) {

        this.current = value;
    }



}, function Swiper() {

    yaxi.Box.apply(this, arguments);

});
