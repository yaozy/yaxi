const yaxi = require('../../../yaxi/js/yaxi');



module.exports = yaxi.DataBox.extend(function (Class, base) {


    this.onload = function (data) {

        this.loadTemplate(require('./test-paper.html'), data);
    }


});
