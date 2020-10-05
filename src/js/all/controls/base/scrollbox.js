yaxi.Box.extend('ScrollBox', function () {



    // 滚动方向
    // x    x轴方向滚动
    // y    y轴方向滚动
    this.$('scroll', 'y');


    // 刷新
    this.$('refresh', null);


    // 下拉刷新
    this.$('pulldown', null);





}, function ScrollBox() {


    yaxi.Box.call(this);


});
