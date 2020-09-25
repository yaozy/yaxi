const yaxi = require('../../yaxi/js/yaxi');
const template = require('./address.html');
const arrayModel = require('./model/address');



module.exports = yaxi.Page.extend(function (Class, base) {

    

    this.init = function () {

        this.load(template(this, {}, arrayModel));

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
                arrayModel[index].$load(model);
            }
            else
            {
                arrayModel.push(model);
            }
        }
    }



    this.handleAdd = function () {

        require('./address-edit').open(arrayModel.create(), onclosed);
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
            arrayModel.splice(index, 1);
        }
    }



});
