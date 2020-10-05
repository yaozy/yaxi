const yaxi = require('../../../yaxi/js/yaxi');



module.exports = yaxi.Box.extend(function (Class, base) {


    this.onload = function (data) {

        this.loadTemplate(require('./info.html'), data);
    }
    

});
