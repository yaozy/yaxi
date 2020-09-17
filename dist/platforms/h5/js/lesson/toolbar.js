const yaxi = require('../../yaxi/js/yaxi');
const template = require('./toolbar.html');


module.exports = yaxi.Box.extend(function (Class, base) {



    var model = yaxi.store = new (yaxi.model({

        type: '',

        hidden: function () {

            return !this.type;
        },

        sort: {
            icon: computeIconFn('sort'),
            hidden: computeHiddenFn('sort'),

            key: 'common',
            text: '综合排序',

            data: [
                {
                    key: '',
                    text: '',

                    theme: function () {

                        return this.$parent.key === this.key ? 'font-primary' : '';
                    }
                }
            ]
        },

        category: {
            icon: computeIconFn('category'),
            hidden: computeHiddenFn('category'),

            key: '',
            text: '全部分类',

            first: 0,
            second: 0,
            third: 0,

            firsts: [
                {
                    id: 0,
                    text: '',
                    theme: computeCategoryThemeFn('first')
                }
            ],
            seconds: [
                {
                    id: 0,
                    text: '',
                    theme: computeCategoryThemeFn('second')
                }
            ],
            thirds: [
                {
                    id: 0,
                    text: '',
                    theme: computeCategoryThemeFn('third')
                }
            ]
        },

        filter: {
            icon: computeIconFn('filter'),
            hidden: computeHiddenFn('filter'),
            
            data: [
                {
                    id: 0,
                    text: '',
                    data: [
                        {
                            id: 0,
                            text: '',

                            style: function () {

                                return 'width:30%;height:60rem;line-height:60rem;margin:0 3% 10rem 0;border-radius:40rem;text-align:center;' 
                                    + (this.checked ? 
                                        'border:.5px solid @border-primary;color:@font-primary;background-color:@bg-level1;' : 
                                        'background-color:@bg-level2;')
                            }
                        }
                    ]
                }
            ]
        }

    }))();


    model.sort.data = [
        { key: 'common', text: '综合排序' },
        { key: 'hot', text: '人气排序' },
        { key: 'price', text: '价格最低' },
        { key: 'price-desc', text: '价格最高' }
    ]

    model.category.firsts = [
        { id: 0, text: '全部', icon: 'tabbar-lesson' },
        { id: 1, text: 'IT', icon: 'tabbar-lesson' },
        { id: 2, text: '设计', icon: 'tabbar-lesson' },
        { id: 3, text: '电商', icon: 'tabbar-lesson' },
        { id: 4, text: '职业', icon: 'tabbar-lesson' },
        { id: 5, text: '升学', icon: 'tabbar-lesson' },
        { id: 6, text: '兴趣', icon: 'tabbar-lesson' },
        { id: 7, text: '语言', icon: 'tabbar-lesson' }
    ]

    model.category.seconds = [
        { id: 0, text: '全部' }
    ]

    model.category.thirds = [
        { id: 0, text: '全部' }
    ]


    model.filter.data = [
        {
            id: 1,
            text: '课程类型',
            single: true,
            data: [
                { id: 11, text: '随到随学', checked: false },
                { id: 12, text: '正在直播', checked: false },
                { id: 13, text: '系列课', checked: false },
            ]
        },
        {
            id: 2,
            text: '价格区间',
            single: true,
            data: [
                { id: 21, text: '免费', checked: false },
                { id: 22, text: '￥50以下', checked: false },
                { id: 23, text: '￥50-100', checked: false },
                { id: 24, text: '￥100-500', checked: false },
                { id: 25, text: '￥500-1000', checked: false },
                { id: 26, text: '￥1000以上', checked: false },
            ]
        },
        {
            id: 3,
            text: '课程内容包含(可多选)',
            single: false,
            data: [
                { id: 31, text: '直播授课', checked: false },
                { id: 32, text: '录播视频', checked: false },
                { id: 33, text: '课程资料', checked: false },
                { id: 34, text: '习题测验', checked: false },
                { id: 35, text: '试听', checked: false },
            ]
        }
    ]



    function computeIconFn(type) {

        return function () {

            return this.$parent.type === type ? 'common-expand' : 'common-collapse';
        }
    }


    function computeHiddenFn(type) {

        return function () {

            return this.$parent.type !== type;
        }
    }


    function computeCategoryThemeFn(name) {

        return function () {

            return this.$parent[name] === this.id ? 'font-primary' : '';
        }
    }




    this.init = function () {

        this.loadTemplate(template, model);
    }



    this.handleClose = function () {

        model.type = '';
    }


    this.handleSwitch = function (event) {

        var type = event.target.tag;
        model.type = model.type === type ? '' : type;
    }


    this.handleSort = function (event) {

        var target = event.target;
        var index = target.key;
        var item;

        if (!index)
        {
            target = target.parent;
            index = target.key;
        }

        var sort = model.sort;

        if (index && (item = sort.data[index - 1]))
        {
            sort.key = item.key;
            sort.text = item.text;

            model.type = '';

            this.trigger(yaxi.Event.from('sort', {
    
                item: item
            }));
        }
    }


    this.handleCategoryFirst = function (event) {

    } 


    this.handleCategorySecond = function (event) {


    }


    this.handleCategoryThird = function (event) {

        
    }



});
