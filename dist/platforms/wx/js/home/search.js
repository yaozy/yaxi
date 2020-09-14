const yaxi = require('../../yaxi/js/yaxi');
const template = require('./search.html');


module.exports = yaxi.Page.extend(function (Class, base) {


    this.init = function () {

        this.loadTemplate(template);
    }


});
