const yaxi = require('../../yaxi/js/yaxi');
const template = require('./address.html');



var arrayModel = new (yaxi.arrayModel({

    id: 0,

    name: '',

    gendle: 0,

    address: '',

    house: '',

    tel: '',
    
    default: false

}))();




module.exports = yaxi.Page.extend(function (Class, base) {



    this.init = function () {

        this.loadTemplate(template, {}, arrayModel);

        yaxi.http.get('my/address').json(function (data) {

            arrayModel.load(data);
        });
    }



    function onclosed(type, model) {

        if (model)
        {
            var index = model.__index;

            if (index >= 0)
            {
                arrayModel[index].$assign(model);
            }
            else
            {
                arrayModel.push(model);
            }
        }
    }




    this.handleDefault = function (event) {

        if (!event.detail)
        {
            return false;
        }

        for (var i = arrayModel.length; i--;)
        {
            if (arrayModel[i].default)
            {
                arrayModel[i].default = false;
                break;
            }
        }
    }

    
    this.handleAdd = function () {

        var model = arrayModel.create();

        model.gendle = 1; 
        require('./address-edit').open(model, onclosed);
    }


    this.handleEdit = function (event) {

        var index = +event.target.parent.tag;

        if (index >= 0)
        {
            var model = arrayModel.copy(index);

            model.__index = index;
            require('./address-edit').open(model, onclosed);
        }
    }


    this.handleDelete = function (event) {

        var index = +event.target.parent.tag;

        if (index >= 0)
        {
            yaxi.MessageBox.delete('这条地址信息', function (type) {

                if (type === 'OK')
                {
                    arrayModel.removeAt(index, 1);
                }
            });
        }
    }



});
