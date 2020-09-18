yaxi.Tab = yaxi.Box.extend(function (Class, base) {



    // 线条(目前只支持top及bottom)
    this.$property('line', 'bottom', {

        class: 'yx-tab-'
    });
    

    // 容器宿主
    this.$property('host', '', {

        change: false
    });



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
                throw 'host of tab control not allow empty!'; 
            }

            if (host[0] !== '<')
            {
                throw 'host of tab control host must use "<" or "<<" to find up!';
            }

            if (host = this.find(host))
            {
                if (host.children)
                {
                    return host;
                }

                throw 'host of must be a Box!';
            }

            throw 'tab control can not find host "' + this.host + '"!';
        }
    });



    function initIndex(index) {

        changeIndex(this, index, -1);
    }


    function changeIndex(tab, index, lastIndex) {

        var children = tab.children;
        var event = new yaxi.Event('changing');
        var item;

        event.lastIndex = lastIndex;
        event.lastPage = tab.findPage(event.lastItem = children[lastIndex] || null);

        event.index = index;
        event.page = tab.findPage(event.item = children[index] || null);

        if (tab.trigger(event) !== false)
        {
            tab.$storage.selectedIndex = index;

            if (item = event.lastPage)
            {
                item.removeClass('yx-tab-page-active');
            }

            if (item = event.lastItem)
            {
                item.selected = false;
            }

            if (item = event.item)
            {
                item.selected = true;
                checkPage(tab, event);
            }

            event.type = 'changed';
            tab.trigger(event);
        }
    }


    function checkPage(tab, event) {

        var page = event.page;
        var item = event.item;

        if (!page)
        {
            if (page = item.module)
            {
                page = event.page = new page();
                tab.selectedHost.children.push(page);
            }
            else
            {
                return;
            }
        }

        if (!page.__tab)
        {
            page.__tab = item.uuid;
            page.addClass('yx-tab-page');
        }

        page.addClass('yx-tab-page-active');
    }



    this.findPage = function (item) {

        if (item)
        {
            var children = this.selectedHost.children;
            var uuid = item.uuid;
    
            for (var i = children.length; i--;)
            {
                if (children[i].__tab === uuid)
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
    


}, function Tab() {


    yaxi.Box.apply(this, arguments);


}).register('Tab');
