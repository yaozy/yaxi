const yaxi = require('../../yaxi/js/yaxi');
const template = require('./follow.html');
const arrayModel = require('./model/follow');



module.exports = yaxi.Page.extend(function (Class, base) {



    this.init = function () {

        this.load(template(this, {}, arrayModel));

        yaxi.http.get('my/follow').json(function (data) {

            arrayModel.load(data);
        });
    }



    this.handleOpenDetail = function (event) {
        
        require('../lesson/detail/main').open(event.source.tag);
    }


});
