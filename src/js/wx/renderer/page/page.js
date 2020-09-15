yaxi.Page.mixin(function (mixin, base, yaxi) {



    var create = Object.create;

    var define = Object.defineProperty;




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


	
	// 获取当前所有页面
    define(yaxi, 'currentPages', {

        get: function () {

            return all.slice();
        }
    });


	// 获取当前页面
	define(yaxi, 'currentPage', {

        get: function () {

            return all[all.length - 1] || null;
        }
    });



	// 打开指定页面
    yaxi.openPage = function (Page, payload, callback) {

        if (typeof payload === 'function')
        {
            callback = payload;
            payload = void 0;
        }

        try
        {
            var page = new Page(payload);
        
            if (page.onopening(payload) !== false)
            {
                all.push(page);
                page.payload = payload;
    
                wx[Page.main ? 'redirectTo' : 'navigateTo']({
    
                    url: '../../yaxi/pages/host?uuid=' + page.uuid,
    
                    success: function () {
    
                        callback && callback(page);
                    }
                });
            }
        }
        catch (e)
        {
            console.error(e);
            throw e;
        }
    }


	// 关闭当前页面
    yaxi.closePage = function (delta, callback) {

        if (typeof delta === 'function')
        {
            callback = delta;
            delta = 1;
        }

        wx.navigateBack({

            delta: delta || 1,
            success: callback
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



    yaxi.__on_page_open = function (uuid, wxPage, wxName) {

        try
        {
            var page = find(uuid);
            var data;

            notifyRender(renderings);

            data = {};
            data[wxName || (wxName = 'data')] = page.render();

            console.log(data);

            page.__wx_page = wxPage;
            page.__wx_name = wxName;

            wxPage.setData(data, function () {

                notifyRender(rendereds);
                page.onopened(page.payload);
            });
        }
        catch (e)
        {
            console.error(e);
            throw e;
        }
    }


    yaxi.__on_page_close = function (uuid) {

        var index = find(uuid, true);
        var page = all[index];

        page.onclosed();

        page.__wx = null;
        page.destroy();

        all.splice(index, 1);
    }



});
