const yaxi = require('../../../yaxi/js/yaxi');
const template = require('./section.html');


module.exports = yaxi.DataBox.extend(function (Class, base) {


    this.init = function (data) {

        this.load(template(this, data));
    }


    this.handleOpenDetail = function (event) {

    }

    

});
