yaxi.Button = yaxi.ContentControl.extend(function (Class, base) {



    this.__no_content = 'content is empty';
    

    
    // 布局
    this.$property('layout', '', {

        class: 'yx-layout-'
    });



}, function Button() {

    yaxi.Control.apply(this, arguments);

}).register('Button');
