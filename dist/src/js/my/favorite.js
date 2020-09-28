const yaxi = require('../../yaxi/js/yaxi');
const template = require('./favorite.html');


const arrayModel = new (yaxi.arrayModel({

    id: 0,
    lessonid: 0,
    name: '',
    image: '',
    price: 0,
    time: ''

}))();



module.exports = yaxi.Page.extend(function (Class, base) {



    this.init = function () {

        this.loadTemplate(template, {}, arrayModel);

        yaxi.http.get('my/favorite').json(function (data) {

            arrayModel.load(data);
        });
    }



    this.handleOpenDetail = function (event) {
        
        require('../lesson/detail/main').open(event.source.tag);
    }


});
