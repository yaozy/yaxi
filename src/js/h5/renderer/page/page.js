yaxi.Page.renderer(function (base, thisControl, yaxi) {



    var define = Object.defineProperty;


	// 页面栈
    var all = [];
    


	var host = yaxi.__view_host;




    this.className = 'yx-control yx-box yx-page';
    

	this.template('<div class="@class"></div>');



	
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

        var stack = all;
        var page;
        
        if (typeof options === 'function')
        {
            callback = options;
            options = null;
        }

        if (page = stack[stack.length - 1])
        {
            page.onhide();
        }

        stack.push(page = new Page(options));
        
        page.onload(page.options = options);
        page.__callback = callback;
        page.onshow();
        
        host.appendChild(page.$renderer.render(page));
	}

	
	// 关闭当前页面
    yaxi.closePage = function (type, payload) {

        var stack = all;
        var page = stack[stack.length - 1];
        var view, options, callback;

        if (page.onunload(options = page.options) !== false)
        {
            // 清除dom
            if (view = page.$view)
            {
                host.removeChild(view);
                view.textContent = '';
            }

            page.options = null;

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
    }
    
    


    yaxi.__on_page_patch = function (patches) {

        var index = 0;
        var control, view;

        while (control = patches[index++])
        {
            if (view = control.$view)
            {
                control.$renderer.patch(control, view);
            }
        }
    }
    


    
});
