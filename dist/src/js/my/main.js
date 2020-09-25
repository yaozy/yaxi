const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');
const user = require('./model/user');



module.exports = yaxi.Box.extend(function (Class, base) {


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
            text: '产品服务',
            data: [
                {
                    icon: 'tabbar-lesson',
                    text: '我的地址',
                    url: './address'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '我的帐户',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '发票抬头',
                    url: './lesson'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '我的订单',
                    url: './order'
                },
                {
                    icon: 'tabbar-lesson',
                    text: '我的资产',
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
