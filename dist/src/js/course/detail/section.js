const yaxi = require('../../../yaxi/js/yaxi');
const template = require('./section.html');


module.exports = yaxi.DataBox.extend(function (Class, base) {


    this.init = function (data) {

        this.loadTemplate(template, data);
    }


    this.handleOpenDetail = function (event) {
        
        require('../course/detail/main').open(event.source.tag);
    }

    

});