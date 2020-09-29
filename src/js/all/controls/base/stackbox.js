yaxi.Box.extend('StackBox', function (Class, base) {



    this.$('layout', {

        get: nolayout,
        set: nolayout
    });


    function nolayout() {

        throw new Error('StackBox control doesn\'t supports layout! can only use full!');
    }



    // 子项是否充满容器
    this.$('full', false);




}, function StackBox() {


    yaxi.Box.apply(this, arguments);


});
