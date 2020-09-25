const yaxi = require('../../yaxi/js/yaxi');
const template = require('./order.html');
const arrayModel = require('./model/order');



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

        this.load(template(this, {}, model));

        yaxi.http.get('my/order').json(function (data) {

            model.data = data;
        });
    }



    this.handleOpenDetail = function (event) {

    }


    this.handleSwitch = function (event) {


    }


});
