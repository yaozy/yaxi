const yaxi = require('../../../yaxi/js/yaxi');
const template = require('./main.html');


module.exports = yaxi.Page.extend(function (Class, base) {


    this.init = function (data) {

        this.load(template.call(this, data));
    }


});
