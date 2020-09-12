const yaxi = require('../js/yaxi');


Page({
    /**
     * 组件的属性列表
     */
    data: {
        top: 0,
        d: Object
    },


    onLoad: function (options) {

        var uuid;
        
        yaxi.getSystemInfo(info => {

            this.setData({ top: info.statusBarHeight });
        });

        if (uuid = options && +options.uuid)
        {
            yaxi.__on_page_open(this.__uuid = uuid, this, 'd');
        }
        else
        {
            wx.navigateBack();
            require('../../js/main').open();
        }
    },


    onUnload: function () {

        var uuid;

        if (uuid = this.__uuid)
        {
            yaxi.__on_page_close(uuid);
        }
    },


    handleEvent: yaxi.wx.translateEvent

})
