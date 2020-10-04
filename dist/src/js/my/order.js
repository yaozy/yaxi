const yaxi = require('../../yaxi/js/yaxi');
const template = require('./order.html');


const arrayModel = yaxi.arrayModel({

    id: 1,
    time: '',
    status: 1,
    data: [
        {
            id: 0,
            courseid: 0,
            name: '',
            image: '',
            price: 0,
            amount: 0
        }
    ],

    total: function () {

        var data = this.data;
        var total = 0;

        for (var i = data.length; i--;)
        {
            total += data[i].amount * data[i].price;
        }

        return Math.round(total * 100) / 100;
    }

});



module.exports = yaxi.Page.extend(function (Class, base) {



    var model = new (yaxi.model({

        status: 0,
        categories: [
            {
                text: '',
                status: 0,

                theme: function () {

                    return this.status === this.$parent.status ? 'text-primary' : '';
                }
            }
        ],
        data: arrayModel
        
    }))();


    model.categories = [
        { text: '全部', status: 0 },
        { text: '待付款', status: 1 },
        { text: '待发货', status: 2 },
        { text: '已完成', status: 3 },
        { text: '已退款', status: 4 }
    ]



    this.init = function () {

        this.loadTemplate(template, {}, model);

        yaxi.http.get('my/order').json(function (data) {

            model.data = data;
        });
    }



    this.handleOpenDetail = function (event) {
        
        require('../course/detail/main').open(event.source.tag);
    }


    this.handleSwitch = function (event) {

        var status = model.status = event.target.tag;

        this.find('>>@host').showLoading();

        yaxi.http.get('my/order', status).json(function (data) {

            model.data = data;
        });
    }


    this.handleDelete = function (event) {

        var data = model.data;
        var index = +event.target.tag;
        var item;

        if ((item = data[index]) && item.status >= 3)
        {
            yaxi.MessageBox.delete('此订单吗', function (type) {

                if (type === 'OK')
                {
                    data.splice(index, 1);
                }
            });
        }
        else
        {
            yaxi.MessageBox.info('不能删除未完成的订单');
        }
    }


});
