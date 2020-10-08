;(function (yaxi) {
    
    

    yaxi.platform = 'wx';



    yaxi.wx = Object.create(null);



    // 获取系统信息
    yaxi.getSystemInfo = function (callbackFn) {

        callbackFn && wx.getSystemInfo({

            success: callbackFn
        });
    }


})(yaxi);

