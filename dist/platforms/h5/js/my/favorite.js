const yaxi = require('../../yaxi/js/yaxi');
const template = require('./favorite.html');



module.exports = yaxi.Page.extend(function (Class, base) {



    this.init = function () {

        this.loadTemplate(template);

        yaxi.http.get('my/favorite').json(function (data) {

            this.find('>>databox').data = data;

        }.bind(this));
    }



    this.handleOpenDetail = function (event) {
        
        require('../course/detail/main').open(event.source.tag);
    }


});
