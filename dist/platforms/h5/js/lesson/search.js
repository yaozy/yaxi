const yaxi = require('../../yaxi/js/yaxi');
const template = require('./search.html');


module.exports = yaxi.Band.extend(function () {


    this.init = function () {

        this.loadTemplate(template);
    }

});
