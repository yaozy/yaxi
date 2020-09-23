const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');


module.exports = yaxi.Box.extend(function (Class, base) {


    var user = require('./user');

    var data = [
        {
            text: '我的学习',
            data: [
                {
                    icon: 'tabbar-lesson',
                    text: '班级',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '课程',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '试卷',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '练习',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '课程表',
                    url: './lesson'
                }
            ]
        },
        {
            text: '我的信息',
            data: [
                {
                    icon: 'tabbar-lesson',
                    text: '地址信息',
                    url: './address'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '帐户信息',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '发票抬头',
                    url: './lesson'
                }
            ]
        },
        {
            text: '我的资产',
            data: [
                {
                    icon: 'tabbar-lesson',
                    text: '账户余额',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '充值',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '提现',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '积分',
                    url: './lesson'
                }
            ]
        },
        {
            text: '我的订单',
            data: [
                {
                    icon: 'tabbar-lesson',
                    text: '全部订单',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '待付款',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '待发货',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '已完成',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '已退款',
                    url: './lesson'
                }
            ]
        },
        {
            text: '其它',
            data: [
                {
                    icon: 'tabbar-lesson',
                    text: '我的收藏',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '我的关注',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '我的点赞',
                    url: './lesson'
                }
            ]
        }
    ];



    this.init = function () {

        this.load(template(this, data, user));
    }



    this.handleOpen = function (event) {

        var tag;

        if (tag = event.target.tag)
        {
            require(tag).open();
        }
    }



    this.openTest = function () {

        require('../test/main').open();
    }

    
});
