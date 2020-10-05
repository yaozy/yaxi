const yaxi = require('../../../yaxi/js/yaxi');



module.exports = yaxi.DataBox.extend(function (Class, base) {



    this.onload = function (data) {

        this.loadTemplate(require('./section.html'), data);
    }


    this.handleOpenDetail = function (event) {
        
        require('../course/detail/main').open(event.source.tag);
    }

    

});
