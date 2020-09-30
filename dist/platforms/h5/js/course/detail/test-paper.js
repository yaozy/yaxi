const yaxi = require('../../../yaxi/js/yaxi');
const template = require('./test-paper.html');


module.exports = yaxi.DataBox.extend(function (Class, base) {


    this.init = function (data) {

        this.loadTemplate(template, data);
    }


});
