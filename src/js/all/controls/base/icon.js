yaxi.Icon = yaxi.Control.extend(function (Class, base) {


    
    // 图标名
    this.$property('icon', '', {

        kind: 'class',
        data: 'icon-'
    });



}, function Icon() {

    yaxi.Control.apply(this, arguments);

}).register('Icon');
