yaxi.Control.extend('Marquee', function (Class, base) {



    this.$('text', '');


    // 速度, 每32字显示的秒数
    this.$('speed', 10);


    
}, function Marquee() {


    yaxi.Control.apply(this, arguments);

    
});
