const yaxi = require('../../../yaxi/js/yaxi');
const template = require('./comment.html');


module.exports = yaxi.Box.extend(function (Class, base) {


    this.init = function (data) {

        this.load(template(this, data));
    }


});
