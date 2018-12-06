// K线图组件
k.CandleStick = yaxi.Canvas.extend(function (Class, base) {



    // 图形组名
    this.name = '';


    // 图形模式
    // 1: K线图
    // 2: 分时图
    this.mode = 1;


    // 是否显示成交量
    this.volume = true;


    // 均线
    this.ma = [5, 10, 30];


    // 布林带 20 2
    this.boll = null;


    // 辅助线
    this.line = {
        h: {
            color: 'silver',
            width: 1,
            dashArray: []
        },
        v: {
            color: 'silver',
            width: 1,
            dashArray: []
        }
    };


    
    // 位置
    this.position = 0;


    // 缩放比
    this.scale = 1;




    this.render = function () {

        k.__bind('' + this.name, this);
        return base.render.call(this);
    }



    this.update = function () {


    }



    function draw(context, items) {


    }


    function ma() {

    }


    function boll() {
    }


    function candlestick() {

    }
    



    this.destory = function () {

        k.__unbind('' + this.name, this);
        base.destory.call(this);
    }


});
