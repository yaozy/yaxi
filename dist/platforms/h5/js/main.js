const yaxi = require('../yaxi/js/yaxi');


module.exports = yaxi.Page.extend(function (Class, base) {


    this.init = function () {

        this.assign({
            children: [
                {
                    Class: yaxi.Header,
                    content: '华旅教育'
                },
                {
                    Class: yaxi.Panel
                },
                {
                    Class: yaxi.Tab,
                    host: '<* >Panel',
                    selectedIndex: 0,
                    subtype: yaxi.ImageButton,
                    children: [
                        {
                            src: '/images/home/home.png',
                            content: '首页',
                            module: require('home/main.js'),
                            selectedStatus: {
                                theme: 'primary',
                                src: '/images/home/home-selected.png'
                            }
                        },
                        {
                            src: '/images/home/category.png',
                            content: '分类',
                            module: require('catgory/main.js'),
                            selectedStatus: {
                                theme: 'primary',
                                src: '/images/home/category-selected.png'
                            }
                        },
                        {
                            src: '/images/home/bought.png',
                            content: '已购',
                            module: require('bought/main.js'),
                            selectedStatus: {
                                theme: 'primary',
                                src: '/images/home/bought-selected.png'
                            }
                        },
                        {
                            src: '/images/home/my.png',
                            content: '我的',
                            module: require('my/main.js'),
                            selectedStatus: {
                                theme: 'primary',
                                src: '/images/home/my-selected.png'
                            }
                        }
                    ]
                }
            ]
        });
    }


});
