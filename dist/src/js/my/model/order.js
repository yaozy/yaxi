const yaxi = require('../../../yaxi/js/yaxi');


module.exports = yaxi.arrayModel({

    id: 1,
    time: '',
    status: 1,
    data: [
        {
            id: 0,
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
