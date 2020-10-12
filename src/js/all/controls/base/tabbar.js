yaxi.Box.extend('TabBar', function (Class, base) {



    // 关联控件的key
    this.$('related', '', false);



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



    this.changeSelected = function (index) {

        var children = this.__children;
        var control;

        for (var i = children.length; i--;)
        {
            if (i !== index && (control = children[i]) && control.selected)
            {
                control.selected = false;
            }
        }

        if (control = children[index])
        {
            control.selected = true;
        }
    }



    this.__set_selectedIndex = function (value, oldValue) {

        if (this.__children[value])
        {
            switchChange(this, value);
        }

        this.trigger('change', value, false);
    }



    function switchChange(tabbar, index) {

        var control;
        
        if (control = tabbar.__find_related(tabbar.related))
        {
            control.selectedIndex = index;
        }

        tabbar.changeSelected(index);
    }


    this.__load_children = function (values, scope) {

        this.__children.load(values, scope);
        switchChange(this, this.selectedIndex);
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
