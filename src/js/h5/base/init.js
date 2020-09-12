;(function (yaxi) {
    
    
    
    var h5 = yaxi.h5 = Object.create(null);

    var update = yaxi.__notify_update;



    yaxi.platform = 'h5';


    // 是否在微信浏览器中打开
    h5.weixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') >= 0;



    yaxi.on('yaxi-page-change', function (event) {

        var host = yaxi.__view_host;
        var page = event.page;
        var index = event.index;
        var callback = event.callback;

        event.page = null;

        if (event.open)
        {
            update(true);

            host.appendChild(page.render());
            page[callback](index);

            update(false);
        }
        else if (page.$view)
        {
            host.removeChild(page.$view);
            page[callback](index);
        }
        
    });


    yaxi.on('yaxi-page-patch', function (event) {

        var patches = event.payload;
        var index = 0;
        var control, view;

        event.payload = null;

        update(true);

        while (control = patches[index++])
        {
            if (view = control.$view)
            {
                control.patch(view);
            }
        }

        update(false);
    });


    // 获取系统信息
    yaxi.getSystemInfo = function (callback) {

        var w = window;
        var n = navigator;
        var s = screen;
        var o = w.orientation;

        callback && callback({
            deviceOrientation: o == 180 || o == 0 ? 'portrait' : 'landscape',
            language: n.language,
            pixelRatio: w.devicePixelRatio,
            platform: n.platform,
            screenHeight: s.height,
            screenWidth: s.width,
            statusBarHeight: 0,
            system: n.appName,
            version: n.appVersion,
            windowHeight: w.innerWidth,
            windowWidth: w.innerHeight
        });
    }



})(yaxi);
