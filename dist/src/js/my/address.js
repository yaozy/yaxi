const yaxi = require('../../yaxi/js/yaxi');
const template = require('./address.html');



module.exports = yaxi.Page.extend(function (Class, base) {



    var arrayModel = new (yaxi.arrayModel({

        id: 0,

        name: '',

        gendle: 0,

        address: '',

        house: '',

        tel: '',
        
        default: false

    }))();


    
    this.init = function () {

        this.load(template(this, {}, arrayModel));

        yaxi.http.get('address').json(function (data) {

            arrayModel.load(data);
        });
    }




    this.handleAdd = function () {

        require('./address-edit').open(arrayModel.create(), function (data) {

            arrayModel.push(data);
        });
    }


    this.handleEdit = function (event) {

        var index = +event.target.parent.tag;

        if (index >= 0)
        {
            require('./address-edit').open(arrayModel.copy(index), function (data) {

                arrayModel.set(index, data);
            });
        }
    }


    this.handleDelete = function (event) {

        var index = +event.target.parent.tag;

        if (index >= 0)
        {
            arrayModel.splice(index, 1);
        }
    }



});
