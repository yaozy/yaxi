const yaxi = require('../js/yaxi');


Page({
    /**
     * 组件的属性列表
     */
    data: {
        top: 0,
        loaded: false,
        pages: []
    },


    onLoad: function () {

        yaxi.wx.init(this, 'pages');

        yaxi.getSystemInfo(info => {

            this.setData({ top: info.statusBarHeight }, () => {

                new (require('../../js/main'))().open();

                setTimeout(() => {

                    this.setData({ loaded: true });

                }, 1000);
            });
        });

    },


    handleEvent: yaxi.wx.translateEvent

})
