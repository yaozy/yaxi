const yaxi = require('../../../yaxi/js/yaxi');
const template = require('./info.html');


module.exports = yaxi.Box.extend(function (Class, base) {


    this.init = function (data) {

        this.loadTemplate(template, data);
    }


});
