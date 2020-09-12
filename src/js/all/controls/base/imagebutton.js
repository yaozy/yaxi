yaxi.ImageButton = yaxi.ContentControl.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.$property('layout', '', {

        class: 'yx-layout-'
    });
    

    // 图像路径
    this.$property('src', '');


    // 图像大小
    this.$property('size', '');



}, function ImageButton() {

    yaxi.Control.apply(this, arguments);

}).register('ImageButton');
