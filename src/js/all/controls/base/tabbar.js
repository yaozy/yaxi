yaxi.TabBar = yaxi.Box.extend(function (Class, base) {



    // 页面容器
    this.$property('host', '', false);



    // 获取或设置当前页索引
    this.$property('selectedIndex', -1, {

        change: false,

        alias: 'selected-index',

        convert: function (value) {

            value = (value |= 0) < 0 ? -1 : value;

            // 第一次设置选中索引时在渲染前再处理,否则host可能没有初始化好
            if (value >= 0)
            {
                yaxi.bindBeforeRender(initIndex, this, [value]);
            }

            return value;
        },

        set: function (value) {

            var lastIndex = this.$storage.selectedIndex;

            if ((value |= 0) < 0)
            {
                value = -1;
            }

            if (lastIndex !== value)
            {
                changeIndex(this, value, lastIndex);
            }
        }

    });



    // 选中的页头
    this.$property('selectedItem', null, {

        get: function () {

            var index = this.selectedIndex;
            return index >= 0 && this.children[index] || null;
        }
    });


    // 选中的页签容器
    this.$property('selectedHost', null, {

        get: function () {

            var host = this.host;

            if (!host)
            {
                host = '<* >StackBox';
            }
            else if (host[0] !== '<')
            {
                throwError('use "<" or "<<" to begin!');
            }

            if (host = this.find(host))
            {
                if (host instanceof yaxi.StackBox)
                {
                    return host;
                }

                throwError('be a StackBox!');
            }

            return null;
        }
    });


    function throwError(text) {

        throw new Error('the host of TabBar must ' + text);
    }



    function initIndex(index) {

        changeIndex(this, index, -1);
    }


    function changeIndex(tabbar, index, lastIndex) {

        var children = tabbar.children;
        var event = new yaxi.Event('changing');
        var item;

        event.lastIndex = lastIndex;
        event.lastPage = tabbar.findPage(event.lastItem = children[lastIndex] || null);

        event.index = index;
        event.page = tabbar.findPage(event.item = children[index] || null);

        if (tabbar.trigger(event) !== false)
        {
            tabbar.$storage.selectedIndex = index;

            if (item = event.lastPage)
            {
                item.hidden = true;
            }

            if (item = event.lastItem)
            {
                item.selected = false;
            }

            if (item = event.item)
            {
                item.selected = true;
                checkPage(tabbar, event);
            }

            event.type = 'changed';
            tabbar.trigger(event);
        }
    }


    function checkPage(tabbar, event) {

        var page = event.page;
        var item = event.item;
        var host;

        if (!page)
        {
            if ((page = item.module) && (host = tabbar.selectedHost))
            {
                page = event.page = new page(item.data);
                host.children.push(page);
            }
            else
            {
                return;
            }
        }

        page.tabbar = item.uuid;
        page.hidden = false;
    }



    this.findPage = function (item) {

        var host;

        if (item && (host = this.selectedHost))
        {
            var children = host.children;
            var uuid = item.uuid;
    
            for (var i = children.length; i--;)
            {
                if (children[i].tabbar === uuid)
                {
                    return children[i];
                }
            }
        }

        return null;
    }



    this.__on_touchend = function (event) {

        var control = this.parentToThis(event.target);

        if (control && !control.selected)
        {
            this.selectedIndex = this.children.indexOf(control);
        }
    }
    


}, function TabBar() {


    yaxi.Box.apply(this, arguments);


}).register('TabBar');
