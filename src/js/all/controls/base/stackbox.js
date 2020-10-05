yaxi.Box.extend('StackBox', function (Class, base) {



    this.$('layout', {

        get: nolayout,
        set: nolayout
    });


    function nolayout() {

        throw new Error('StackBox control doesn\'t supports layout!');
    }



    // 关联TabBar的key
    this.$('tabar', '', false);


    // 获取或设置当前页索引
    this.$('selectedIndex', -1, {

        force: true,
        alias: 'selected-index',

        convert: function (value) {

            return (value |= 0) < 0 ? -1 : value;
        }
    });



    // 选中的页头
    this.$('selectedItem', null, {

        get: function () {

            var index = this.selectedIndex | 0;
            return index >= 0 && this.__children[index] || null;
        }
    });



    this.__set_selectedIndex = function (value, oldValue) {

        if (this.__children[value])
        {
            switchChange(this, value, oldValue);
        }

        this.trigger('change', { index: value, lastIndex: oldValue });
    }
    

    function switchChange(stackbox, index, oldIndex) {

        var children = stackbox.__children;
        var control;

        if (control = (control = stackbox.tabbar) && stackbox.root.findByKey(control))
        {
            control.selectedIndex = index;
        }

        if (control = oldIndex >= 0 && children[oldIndex])
        {
            control.onhide && control.onhide();
        }
    
        if (control = children[index])
        {
            if (!control.__shown)
            {
                control.__shown = true;
                control.onload && control.onload();
            }

            control.onshow && control.onshow();
        }
    }


    this.__load_children = function (values, scope) {

        this.__children.load(values, scope);
        switchChange(this, this.selectedIndex, -1);
    }



}, function StackBox() {


    yaxi.Box.apply(this, arguments);


});
