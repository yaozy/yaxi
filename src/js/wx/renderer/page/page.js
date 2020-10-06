yaxi.Page.renderer(function (base, yaxi) {



    var create = Object.create;

    var define = Object.defineProperty;




	// 页面栈
    var all = [];
    


    // 渲染前处理集合
    var renderings = [];

    // 渲染后处理集合
    var rendereds = [];




    function find(uuid) {

        var list = all;

        for (var i = list.length; i--;)
        {
            if (list[i].uuid === uuid)
            {
                return list[i];
            }
        }

        throw new Error('can not find uuid ' + uuid + ' of page!');
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




    // 打开微信主页面
    yaxi.openMainPage = function (Page, options, wxPage) {

        var page = new Page(options);
        var uuid = page.uuid;

        all.push(page);
        page.onload(page.options = options);

        yaxi.__on_page_open(uuid, wxPage, true);

        return uuid;
    }
    

	// 打开指定页面
    yaxi.openPage = function (Page, options, callback) {

        var stack = all;
        var wxPage, page;
    
        if (typeof options === 'function')
        {
            callback = options;
            options = null;
        }
        
        if (page = stack[stack.length - 1])
        {
            wxPage = page.__wx_page;
            page.onhide();
        }

        stack.push(page = new Page(options));

        page.onload(page.options = options);
        page.__callback = callback;
        page.onshow();

        // 对话框直接嵌在当前页面内, 不创建新的微信页面
        if (page instanceof yaxi.Dialog && all.length > 0)
        {
            page.__wx_page = wxPage;
            openDialog(page, options, callback);
        }
        else
        {
            wx.navigateTo({

                url: '../../yaxi/pages/host?uuid=' + page.uuid
            });
        }
    }


	// 关闭当前页面
    yaxi.closePage = function (type, payload) {

        var page = all[all.length - 1];
        var wxPage, data;

        if (page && page.onunload(page.options) !== false)
        {
            // 对话框
            if (wxPage = page.__wx_dialog)
            {
                data = {};
                data[wxPage] = null;

                wxPage = page.__wx_page;
                wxPage.setData(data, function () {

                    closePage(type, payload);
                    wxPage.__wx_index--;
                });
            }
            else // 页面
            {
                wx.navigateBack({

                    delta: 1,
                    complete: function () {

                        closePage(type, payload);
                    }
                });
            }
        }
	}
    


    yaxi.__on_page_open = function (uuid, wxPage) {

        yaxi.getSystemInfo(info => {

            var page = find(uuid);
            var data;

            notifyRender(renderings);

            page.__wx_page = wxPage;

            data = page.$renderer.render(page);

            console.log(data);

            wxPage.setData({ top: info.statusBarHeight | 0, p: data }, function () {

                notifyRender(rendereds);
            });
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

                control.$renderer.patch(control, data = create(null), control.__wx_dialog || 'p');
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



    function openDialog(dialog) {

        var wxPage = dialog.__wx_page;
        var index = ++wxPage.__wx_index || (wxPage.__wx_index = 0);
        var data;

        notifyRender(renderings);

        data = {};
        data[index = 'd[' + index + ']'] = dialog.$renderer.render(dialog);

        console.log(data);

        wxPage.setData(data, function () {

            notifyRender(rendereds);
        });

        // 标记对话框关闭数据, 关闭对话框时用
        dialog.__wx_dialog = index;
    }


    function closePage(type, payload) {

        var stack = all;
        var page = stack[stack.length - 1];
        var callback;

        page.options = page.__wx_page = null;
        page.destroy();

        page.__shrink_uuid();
        
        stack.pop();

        if (callback = page.__callback)
        {
            page.__callback = null;
            callback(type, payload);
        }

        if (page = stack[stack.length - 1])
        {
            page.onshow();
        }
    }


});
