const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');




module.exports = yaxi.Box.extend(function (Class, base) {

    

    this.init = function () {

        this.loadTemplate(template);

        yaxi.http.get('course/list').json(function (data) {

            this.find('>>@course-box').data = data;

        }.bind(this));
    }


    
    this.handleOpenDetail = function (event) {

        require('../course/detail/main').open(event.source.tag);
    }



});
