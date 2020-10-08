const yaxi = require('../js/yaxi');


Page({
    /**
     * 组件的属性列表
     */
    data: {
        top: Number,    // 状态栏高度
        p: Object,      // 页面配置
        d: Array        // 对话框集合
    },


    onLoad: function (options) {

        var uuid;
        
        if (uuid = options && +options.uuid)
        {
            yaxi.__on_page_open(uuid, this);
        }
        else
        {
            yaxi.openMainPage(require('../../js/main'), options, this);
        }

    },


    onShareAppMessage: function (options) {

    　　return {
    　　　　title: "华旅云创",              // 默认是小程序的名称(可以写slogan等)
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


    // 不冒泡事件直接转换
    translateEvent: yaxi.wx.translateEvent

    
})
