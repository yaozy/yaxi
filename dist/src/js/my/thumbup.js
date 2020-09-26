const yaxi = require('../../yaxi/js/yaxi');
const template = require('./thumbup.html');
const arrayModel = require('./model/thumbup');



module.exports = yaxi.Page.extend(function (Class, base) {



    this.init = function () {

        this.load(template(this, {}, arrayModel));

        yaxi.http.get('my/thumbup').json(function (data) {

            arrayModel.load(data);
        });
    }



    this.handleOpenDetail = function (event) {
        
        require('../lesson/detail/main').open(event.source.tag);
    }


});
