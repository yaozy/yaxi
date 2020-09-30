const yaxi = require('../../yaxi/js/yaxi');
const template = require('./course.html');



module.exports = yaxi.Page.extend(function (Class, base) {



    this.init = function () {

        this.loadTemplate(template);

        yaxi.http.get('my/course').json(function (data) {

            this.find('>>databox').data = data;

        }.bind(this));
    }



    this.handleOpenDetail = function (event) {
        
        require('../course/detail/main').open(event.source.tag);
    }



});
