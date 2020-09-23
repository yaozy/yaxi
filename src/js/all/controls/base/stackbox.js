yaxi.StackBox = yaxi.Box.extend(function (Class, base) {


    
    this.$property('layout', {

        get: nolayout,
        set: nolayout
    });


    function nolayout() {

        throw new Error('StackBox control doesn\'t supports layout! can only use full!');
    }



    // 当前项
    this.$property('current', 0);


    // 子项是否充满容器
    this.$property('full', false, {

        kind: 'class',
        data: 'yx-layout-stackbox-full'
    });



}, function StackBox() {

    yaxi.Box.apply(this, arguments);

}).register('StackBox');
