yaxi.Page.renderer(function (base, thisControl, yaxi) {



    var create = Object.create;

    var define = Object.defineProperty;



	// 页面栈
    var all = [];
    



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
    yaxi.openPage = function (Page, options, callbackFn) {

        var stack = all;
        var wxPage, page;
    
        if (typeof options === 'function')
        {
            callbackFn = options;
            options = null;
        }
        
        if (page = stack[stack.length - 1])
        {
            wxPage = page.__po;
            page.onhide();
        }

        stack.push(page = new Page(options));

        page.onload(page.options = options);
        page.__cb = callbackFn;
        page.onshow();

        // 对话框直接嵌在当前页面内, 不创建新的微信页面
        if (page instanceof yaxi.Dialog && all.length > 0)
        {
            page.__po = wxPage;
            openDialog(page, options, callbackFn);
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
            if (wxPage = page.__pod)
            {
                data = {};
                data[wxPage] = null;

                wxPage = page.__po;
                wxPage.setData(data, function () {

                    closePage(type, payload);
                    wxPage.__poi--;
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

            yaxi.remRatio = 1 / info.pixelRatio;
            page.__po = wxPage;
            

            data = page.$renderer.render(page);
            data = { top: 0, p: data };

            if (!page.full)
            {
                data.top = info.statusBarHeight || 0;
            }

            console.log(data);

            wxPage.setData(data);
        });
    }


    yaxi.__on_page_patch = function (patches) {

        var index = 0;
        var control, page, data;

        while (control = patches[index++])
        {
            if (page = control.__po)
            {
                control.$renderer.patch(control, data = create(null), control.__pod || 'p');
                console.log(data);

                page.setData(data);
            }
        }
    }



    function openDialog(dialog) {

        var wxPage = dialog.__po;
        var index = ++wxPage.__poi || (wxPage.__poi = 0);
        var data;

        data = {};
        data[index = 'd[' + index + ']'] = dialog.$renderer.render(dialog);

        console.log(data);

        wxPage.setData(data);

        // 标记对话框关闭数据, 关闭对话框时用
        dialog.__pod = index;
    }


    function closePage(type, payload) {

        var stack = all;
        var page = stack[stack.length - 1];
        var callbackFn;

        page.options = page.__po = null;
        page.destroy();

        page.__shrink_uuid();
        
        stack.pop();

        if (callbackFn = page.__cb)
        {
            page.__cb = null;
            callbackFn(type, payload);
        }

        if (page = stack[stack.length - 1])
        {
            page.onshow();
        }
    }


});
