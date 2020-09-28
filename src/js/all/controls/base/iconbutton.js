yaxi.IconButton = yaxi.Control.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.property('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });
    

    // 图标名
    this.property('icon', '');


    // 图标大小
    this.property('size', '');


    // 文字内容
    this.property('text', '');



    this.__load_children = function (values) {

        this.text = values;
    }



}, function IconButton() {


    yaxi.Control.apply(this, arguments);

    
}).register('IconButton');
