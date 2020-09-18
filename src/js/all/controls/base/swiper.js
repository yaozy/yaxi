yaxi.Swiper = yaxi.Box.extend(function (Class, base) {



    // 是否显示面板指示点
    this.$property('dots', true);


    // 指示点样式
    this.$property('dotStyle', '', {

        alias: 'dot-style'
    });


    // 活动指示点颜色
    this.$property('activeDotStyle', '', {

        alias: 'dot-active-style'
    });


    // 是否自动切换
    this.$property('autoplay', false);


    // 当前所在滑块的 index
    this.$property('current', 0);


    // 自动切换时间间隔
    this.$property('interval', 5000);


    // 滑动动画时长
    this.$property('duration', 500);


    // 是否采用衔接滑动
    this.$property('circular', 500);


    // 滑动方向是否为纵向
    this.$property('vertical', false);


    // 前边距, 可用于露出前一项的一小部分, 接受px和rem值
    this.$property('before', '');


    // 后边距, 可用于露出后一项的一小部分, 接受px和rem值
    this.$property('after', '');



    this.__on_change = function (event) {

        this.current = event.value;
    }



}, function Swiper() {

    yaxi.Box.apply(this, arguments);

}).register("Swiper");
