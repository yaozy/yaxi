const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');


module.exports = yaxi.Box.extend(function (Class, base) {


    this.onload = function () {

        this.loadTemplate(template);
    }


});
