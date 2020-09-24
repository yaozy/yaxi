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



    this.afterEdit = function (model) {

        var index = arrayModel.indexOf(model);

        if (index >= 0)
        {
            arrayModel.set(index, model);
        }
        else
        {
            arrayModel.push(model);
        }
    }



    this.handleAdd = function () {

        require('./address-edit').open(this, arrayModel.create());
    }


    this.handleEdit = function (event) {

        var index = +event.target.parent.tag;

        if (index >= 0)
        {
            require('./address-edit').open(this, arrayModel.copy(index));
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
