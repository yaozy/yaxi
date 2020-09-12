;(function (yaxi) {
    
    
    
    var h5 = yaxi.h5 = Object.create(null);



    yaxi.platform = 'h5';


    // 是否在微信浏览器中打开
    h5.weixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') >= 0;



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
