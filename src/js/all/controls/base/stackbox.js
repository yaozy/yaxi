yaxi.Box.extend('StackBox', function (Class, base) {



    // 不支持layout属性
    this.__no_layout();



    // 联动控件的key
    this.$('related', '', false);



    // 获取或设置当前页索引
    this.$('selectedIndex', 0, {

        force: true,
        alias: 'selected-index',

        convert: function (value) {

            return (value |= 0) < 0 ? 0 : value;
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

        if (control = stackbox.__find_related(stackbox.related))
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
