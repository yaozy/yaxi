const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');
const user = require('./model/user');



module.exports = yaxi.Box.extend(function (Class, base) {


    var data = [
        {
            text: '我的学习',
            data: [
                {
                    icon: 'my-class',
                    text: '班级',
                    url: './lesson'
                },
                {
                    icon: 'my-course',
                    text: '课程',
                    url: './lesson'
                },
                {
                    icon: 'my-test',
                    text: '试卷',
                    url: './lesson'
                },
                {
                    icon: 'my-exercise',
                    text: '练习',
                    url: './lesson'
                },
                {
                    icon: 'my-timetable',
                    text: '课程表',
                    url: './lesson'
                }
            ]
        },
        {
            text: '产品服务',
            data: [
                {
                    icon: 'common-address',
                    text: '我的地址',
                    url: './address'
                },
                {
                    icon: 'my-account',
                    text: '我的帐户',
                    url: './lesson'
                },
                {
                    icon: 'my-receipt',
                    text: '发票抬头',
                    url: './lesson'
                },
                {
                    icon: 'my-order',
                    text: '我的订单',
                    url: './order'
                },
                {
                    icon: 'my-asset',
                    text: '我的资产',
                    url: './lesson'
                }
            ]
        },
        {
            text: '其它',
            data: [
                {
                    icon: 'common-favorite',
                    text: '我的收藏',
                    url: './lesson'
                },
                {
                    icon: 'common-follow',
                    text: '我的关注',
                    url: './lesson'
                },
                {
                    icon: 'common-thumbup',
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
