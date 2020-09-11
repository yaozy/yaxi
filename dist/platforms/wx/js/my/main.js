const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');


module.exports = yaxi.Panel.extend(function (Class, base) {


    this.init = function () {

        this.assign(template(this));
    }


});
