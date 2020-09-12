const yaxi = require('../js/yaxi');


Page({
    /**
     * 组件的属性列表
     */
    data: {
        top: 0,
        data: Object
    },


    onLoad: function (options) {

        var uuid;
        
        yaxi.wx.getSystemInfo(info => {

            this.setData({ top: info.statusBarHeight });
        });

        if (uuid = options && +options.uuid)
        {
            yaxi.wx.__on_page_open(this.__uuid = uuid, this, 'data');
        }
        else
        {
            yaxi.redirectTo(require('../../js/main'));
        }
    },


    onUnload: function () {

        var uuid;

        if (uuid = this.__uuid)
        {
            yaxi.wx.__on_page_close(uuid);
        }
    },


    handleEvent: yaxi.wx.translateEvent

})
