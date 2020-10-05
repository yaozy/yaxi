yaxi.Page.renderer(function (base) {



    var define = Object.defineProperty;


	// 页面栈
    var all = [];
    


    // 渲染前处理集合
    var renderings = [];

    // 渲染后处理集合
	var rendereds = [];
	


	var host = yaxi.__view_host;




    this.className = 'yx-control yx-box yx-page';
    

	this.template('<div class="@class"></div>');



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
	yaxi.openPage = function (Page, options, callback) {

        if (typeof options === 'function')
        {
            callback = options;
            options = null;
        }

        var page = new Page(options);
        var last;
        
        if (page.onloading(options) !== false)
        {
            if (last = all[all.length - 1])
            {
                last.onhide();
            }

            all.push(page);

            page.options = options;
            page.__callback = callback;

            notifyRender(renderings);
            
			host.appendChild(page.$renderer.render(page));

            notifyRender(rendereds);

            page.onload(page.options);
            page.onshow();
		}
	}

	
	// 关闭当前页面
    yaxi.closePage = function (type, payload) {

        var page, view, options, callback;

        if (page = all.pop())
        {
            if (page.onunloading(options = page.options) !== false)
            {
                // 清除dom
                if (view = page.$view)
                {
                    host.removeChild(view);
                    view.textContent = '';
                }

                page.onunload(options);
                page.options = null;

                page.destroy();
                page.__shrink_uuid();
                
                if (callback = page.__callback)
                {
                    page.__callback = null;
                    callback(type, payload);
                }

                if (page = all[all.length - 1])
                {
                    page.onshow();
                }
            }
            else
            {
                all.push(page);
            }
        }
    }
    
    


    yaxi.__on_page_patch = function (patches) {

        var index = 0;
        var control, view;

        notifyRender(renderings);

        while (control = patches[index++])
        {
            if (view = control.$view)
            {
                control.$renderer.patch(control, view);
            }
        }

        notifyRender(rendereds);
    }


    
});
