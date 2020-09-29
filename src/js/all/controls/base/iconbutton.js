yaxi.Control.extend('IconButton', function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.$('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });
    

    // 图标名
    this.$('icon', '');


    // 图标大小
    this.$('size', '');


    // 文字内容
    this.$('text', '');



    this.__load_children = function (values) {

        this.text = values;
    }



}, function IconButton() {


    yaxi.Control.apply(this, arguments);

    
});
