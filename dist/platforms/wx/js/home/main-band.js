const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main-band.html');



module.exports = yaxi.Box.extend(function (Class, base) {


    this.init = function (data) {

        Object.assign(this, data);
        this.loadTemplate(template);
    }


});
