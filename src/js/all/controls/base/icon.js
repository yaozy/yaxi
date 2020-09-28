yaxi.Icon = yaxi.Control.extend(function (Class, base) {



    this.$class += ' iconfont'

    
    // 图标名
    this.$('icon', '', {

        kind: 'class',
        data: 'icon-'
    });



}, function Icon() {

    yaxi.Control.apply(this, arguments);

}).register('Icon');
