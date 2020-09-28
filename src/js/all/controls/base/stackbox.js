yaxi.StackBox = yaxi.Box.extend(function (Class, base) {



    this.property('layout', {

        get: nolayout,
        set: nolayout
    });


    function nolayout() {

        throw new Error('StackBox control doesn\'t supports layout! can only use full!');
    }



    // 子项是否充满容器
    this.property('full', false);




}, function StackBox() {

    yaxi.Box.apply(this, arguments);

}).register('StackBox');
