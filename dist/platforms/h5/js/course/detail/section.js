const yaxi = require('../../../yaxi/js/yaxi');



module.exports = yaxi.DataBox.extend(function (Class, base) {



    this.onload = function () {

        this.loadTemplate(require('./section.html'), this.tag);
    }


    this.handleOpenDetail = function (event) {
        
        require('../course/detail/main').open(event.source.tag);
    }

    

});
