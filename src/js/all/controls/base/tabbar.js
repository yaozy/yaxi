yaxi.Box.extend('TabBar', function (Class, base) {



    // 关联容器的key
    this.$('stackbox', '', false);


    // 获取或设置当前页索引
    this.$('selectedIndex', 0, {

        force: true,
        change: false,
        alias: 'selected-index',

        convert: function (value) {

            return (value |= 0) < 0 ? -1 : value;
        }
    });



    // 选中的页头
    this.$('selectedItem', null, {

        get: function () {

            var index = this.selectedIndex;
            return index >= 0 && this.__children[index] || null;
        }
    });



    this.__set_selectedIndex = function (value, oldValue) {

        if (this.__children[value])
        {
            switchChange(this, value, oldValue);
        }

        this.trigger('change', {
            index: value,
            lastIndex: oldValue
        });
    }



    function switchChange(tabbar, index, oldIndex) {

        var children = tabbar.__children;
        var control = tabbar.stackbox;
        
        if (control = control ? tabbar.root.findByKey(control) : tabbar.parent.find('>stackbox'))
        {
            control.selectedIndex = index;
        }

        if (control = oldIndex >= 0 && children[oldIndex])
        {
            control.selected = false;
        }
    
        if (control = children[index])
        {
            control.selected = true;
        }
    }


    this.__load_children = function (values, scope) {

        this.__children.load(values, scope);
        switchChange(this, this.selectedIndex, -1);
    }



    this.__on_touchend = function (event) {

        var control = this.parentToThis(event.target);

        if (control && !control.selected)
        {
            var index = this.__children.indexOf(control);

            if (index >= 0 && this.trigger('changing', { 
                index: index, 
                lastIndex: this.selectedIndex 
            }) !== false)
            {
                this.selectedIndex = index;
            }
        }
    }
    


}, function TabBar() {


    yaxi.Box.apply(this, arguments);


});
