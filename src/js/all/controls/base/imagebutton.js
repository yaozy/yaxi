yaxi.ImageButton = yaxi.Control.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.property('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });
    

    // 图像路径
    this.property('src', '');


    // 图像大小
    this.property('size', '');


    // 文字内容
    this.property('text', '');



    this.__load_children = function (values) {

        this.text = values;
    }



}, function ImageButton() {


    yaxi.Control.apply(this, arguments);

    
}).register('ImageButton');
