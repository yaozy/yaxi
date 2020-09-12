yaxi.Page.mixin(function (mixin, base, yaxi) {



    var create = Object.create;


	// 页面栈
    var all = [];
    


    // 渲染前处理集合
    var renderings = [];

    // 渲染后处理集合
    var rendereds = [];




    function find(uuid, index) {

        var list = all;

        for (var i = list.length; i--;)
        {
            if (list[i].uuid === uuid)
            {
                return index ? i : list[i];
            }
        }

        throw 'can not find uuid ' + uuid + ' of page!';
    }


    function open(Page, payload) {

        var page = new Page(payload);
        
        if (page.onopening(payload) !== false)
        {
            all.push(page);
            page.payload = payload;

            wx.navigateTo({

                url: '../../yaxi/pages/host?uuid=' + page.uuid
            });
        }
    }



    // 通知渲染
    function notifyRender(list) {

        var index = 0;
        var fn;

        while (fn = list[index++])
        {
            fn.apply(list[index++], list[index++]);
        }

        list.length = 0;
    }


    // 注册渲染前事件
    yaxi.bindBeforeRender = function (fn, control, args) {

        renderings.push(fn, control, args);
    }


    // 注册渲染后事件
    yaxi.bindAfterRender = function (fn, control, args) {

        rendereds.push(fn, control, args);
    }


	
	// 获取所有页面
	yaxi.getAllPages = function () {

		return all.slice();
	}


	// 获取当前页面
	yaxi.getCurrentPage = function () {

		return all[all.length - 1] || null;
	}



    // 关闭所有页面后打开指定的页面
    yaxi.reLaunch = function (Page, payload) {

        if (all[0])
        {
            wx.navigateBack({

                delta: all.length
            });
        }

        open(Page, payload);
    }
    

	// 关闭当前页面后打开指定的页面
    yaxi.redirectTo = function (Page, payload) {

        if (all[0])
        {
            wx.navigateBack();
        }

        open(Page, payload);
    }


	// 不关闭当前页面后打开指定的页面
    yaxi.navigateTo = function (Page, payload) {

        open(Page, payload);
    }


	// 关闭
    yaxi.navigateBack = function (delta) {

        wx.navigateBack({

            delta: delta || 1
        });
	}
    
    

    yaxi.__on_page_patch = function (patches) {

        var index = 0;
        var times = 0;
        var control, page, data;

        notifyRender(renderings);

        while (control = patches[index++])
        {
            if (page = control.__wx_page)
            {
                times++;

                control.patch(data = create(null), control.__wx_name);
                console.log(data);

                page.setData(data, function () {

                    if (--times <= 0)
                    {
                        notifyRender(rendereds);
                    }
                });
            }
        }
    }



    yaxi.wx.__on_page_open = function (uuid, wxPage, wxName) {

        try
        {
            var page = find(uuid);
            var data;

            notifyRender(renderings);

            data = {};
            data[wxName || (wxName = 'data')] = page.render();

            console.log(data);

            wxPage.setData(data, function () {

                notifyRender(rendereds);

                page.onopened(page.payload);
    
                page.__wx_page = wxPage;
                page.__wx_name = wxName;
            });
        }
        catch (e)
        {
            console.error(e);
            throw e;
        }
    }


    yaxi.wx.__on_page_close = function (uuid) {

        var index = find(uuid, true);
        var page = all[index];

        page.onclosed(page.payload);

        page.__wx = null;
        page.destroy();

        all.splice(index, 1);
    }



});
