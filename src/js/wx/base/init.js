;(function (yaxi) {
    
    

    yaxi.platform = 'wx';



    yaxi.wx = Object.create(null);



    // 获取系统信息
    yaxi.getSystemInfo = function (callback) {

        callback && wx.getSystemInfo({

            success: function (res) {
                
                yaxi.wx.statusBarHeight = res.statusBarHeight;
                callback(res);
            }
        });
    }


})(yaxi);

