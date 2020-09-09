const yaxi = require('../yaxi/js/yaxi');


module.exports = yaxi.Page.extend(function (Class, base) {


    this.init = function () {

        this.assign({
            children: [
                {
                    Class: yaxi.Header,
                    content: 'yaxi main page'
                },
                {
                    Class: yaxi.Panel
                },
                {
                    Class: yaxi.Tab,
                    host: '<* >Panel',
                    selectedIndex: 0,
                    children: [
                        {
                            icon: 'icon-yaxi-weixin',
                            content: '点餐',
                            module: require('food/main.js'),
                            selectedStatus: {
                                theme: 'primary'
                            }
                        },
                        {
                            icon: 'icon-yaxi-weixin',
                            content: '订单',
                            module: require('order/main.js'),
                            selectedStatus: {
                                theme: 'primary'
                            }
                        },
                        {
                            icon: 'icon-yaxi-weixin',
                            content: '我的',
                            module: require('my/main.js'),
                            selectedStatus: {
                                theme: 'primary'
                            }
                        }
                    ]
                }
            ]
        });
    }


});
