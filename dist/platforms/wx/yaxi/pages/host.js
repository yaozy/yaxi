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
            require('../../js/main').open(options);
        }
    },


    onUnload: function () {

        var uuid;

        if (uuid = this.__uuid)
        {
            yaxi.__on_page_close(uuid);
        }
    },


    onShareAppMessage: function (options) {

    　　return {
    　　　　title: "华旅教育",              // 默认是小程序的名称(可以写slogan等)
    　　　　path: '/yaxi/pages/host?',     // 默认是当前页面，必须是以‘/’开头的完整路径
    　　　　imageUrl: '',     //自定义图片路径, 可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    　　　　success: function(res) {

    　　　　},
    　　　　fail: function() {
    　　　　　　
    　　　　},
    　　　　complete: function() {
    　　　　　　
    　　　　}
    　　}
    },


    handleEvent: yaxi.wx.translateEvent

})
