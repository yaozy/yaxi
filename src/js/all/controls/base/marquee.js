yaxi.Marquee = yaxi.Control.extend(function (Class, base) {



    this.property('text', '');


    // 速度, 每32字显示的秒数
    this.property('speed', 10);


    
}, function Marquee() {

    yaxi.Control.apply(this, arguments);

}).register('Marquee');
