const yaxi = require('../../../yaxi/js/yaxi');



module.exports = yaxi.Box.extend(function (Class, base) {


    this.onload = function () {

        this.loadTemplate(require('./info.html'), this.tag);
    }
    

});
