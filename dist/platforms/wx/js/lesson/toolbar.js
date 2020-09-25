const yaxi = require('../../yaxi/js/yaxi');
const template = require('./toolbar.html');
const model = require('./model/toolbar');


module.exports = yaxi.Box.extend(function (Class, base) {



    const all = { id: 0, text: '全部' };


    model.$load({

        sort: {
            data: [
                { key: 'common', text: '综合排序' },
                { key: 'hot', text: '人气排序' },
                { key: 'price', text: '价格最低' },
                { key: 'price-desc', text: '价格最高' }
            ]
        },

        category: {

            level1s: [
                { id: 0, text: '全部', icon: 'tabbar-lesson' },
                { id: 1, text: 'IT', icon: 'tabbar-lesson' },
                { id: 2, text: '设计', icon: 'tabbar-lesson' },
                { id: 3, text: '电商', icon: 'tabbar-lesson' },
                { id: 4, text: '职业', icon: 'tabbar-lesson' },
                { id: 5, text: '升学', icon: 'tabbar-lesson' },
                { id: 6, text: '兴趣', icon: 'tabbar-lesson' },
                { id: 7, text: '语言', icon: 'tabbar-lesson' }
            ],

            level2s: [all],

            level3s: [all]
        },

        filter: {
            
            data: [
                {
                    id: 1,
                    text: '课程类型',
                    single: true,
                    checked: [],
                    data: [
                        { id: 11, text: '随到随学' },
                        { id: 12, text: '正在直播' },
                        { id: 13, text: '系列课' },
                    ]
                },
                {
                    id: 2,
                    text: '价格区间',
                    single: true,
                    checked: [],
                    data: [
                        { id: 21, text: '免费' },
                        { id: 22, text: '￥50以下' },
                        { id: 23, text: '￥50-100' },
                        { id: 24, text: '￥100-500' },
                        { id: 25, text: '￥500-1000' },
                        { id: 26, text: '￥1000以上' },
                    ]
                },
                {
                    id: 3,
                    text: '课程内容包含(可多选)',
                    single: false,
                    checked: [],
                    data: [
                        { id: 31, text: '直播授课' },
                        { id: 32, text: '录播视频' },
                        { id: 33, text: '课程资料' },
                        { id: 34, text: '习题测验' },
                        { id: 35, text: '试听' },
                    ]
                }
            ]
        }

    });




    this.init = function () {

        this.load(template(this, {}, model));
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

        if (index && (item = sort.data[index]))
        {
            sort.key = item.key;
            sort.text = item.text;

            model.type = '';

            this.trigger(new yaxi.Event('sort', item));
        }
    }


    this.handleCategoryLevel1 = function (event) {

        var index = +event.target.key;

        if (index >= 0)
        {
            var category = model.category;
            var item = category.level1s[index];

            category.level1 = item;
            category.level2 = category.level3 = all;

            if (item.id)
            {
                var text = item.text + '-';

                category.level2s = [
                    all,
                    { id: 1, text: text + '演示数据1' },
                    { id: 2, text: text + '演示数据2' },
                    { id: 3, text: text + '演示数据3' }
                ];

                category.level3s = [
                    all,
                    { id: 1, text: text + '演示数据1-1' },
                    { id: 2, text: text + '演示数据1-2' },
                    { id: 3, text: text + '演示数据1-3' }
                ];
            }
            else
            {
                category.level2s = [all];
            }
        }
    }


    this.handleCategoryLevel2 = function (event) {

        var index = +event.target.key;

        if (index >= 0)
        {
            var category = model.category;
            var item = category.level2s[index];

            category.level2 = item;
            category.level3 = all;

            if (item.id)
            {
                var text = item.text + '-';

                category.level3s = [
                    all,
                    { id: 1, text: text + '1' },
                    { id: 2, text: text + '2' },
                    { id: 3, text: text + '3' }
                ];
            }
            else
            {
                category.level3s = [all];
            }
        }
    }


    this.handleCategoryLevel3 = function (event) {

        var index = +event.target.key;

        if (index >= 0)
        {
            var category = model.category;
            var item = category.level3s[index];

            model.type = '';

            category.text = item.id && item.text || 
                category.level2.id && category.level2.text || 
                category.level1.text;

            category.level3 = item;

            this.trigger('category', item);
        }
    }



    this.handleChangeFilter = function (event) {

        var target = event.target;
        var parent = target.parent;

        if (parent && parent.tag === 'filter')
        {
            var group = model.filter.data[+parent.key];
            var checked = group.checked;
            var item = group.data[+target.key];
            var id = item.id + ',';

            if (checked.indexOf(id) >= 0)
            {
                group.checked = checked.replace(id, '');
            }
            else
            {
                group.checked = group.single ? id : checked + id;
            }
        }
    }


    this.handleClearFilter = function () {

        var group = model.filter.data;

        for (var i = group.length; i--;)
        {
            group[i].checked = '';
        }
    }


    this.handleFilter = function () {

        var group = model.filter.data;
        var detail;

        for (var i = group.length; i--;)
        {
            var item = group[i];

            if (item.checked)
            {
                (detail || (detail = {}))[item.id] = item.checked;
            }
        }

        model.type = '';

        this.trigger('filter', detail);
    }



});
