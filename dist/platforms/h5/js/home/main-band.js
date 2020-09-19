const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main-band.html');



module.exports = yaxi.Box.extend(function (Class, base) {


    this.init = function (data) {

        this.load(template.call(this, data));
    }


    this.handleOpenDetail = function (event) {

        var control;

        if (control = event.target.findHasTag())
        {
            require('../lesson/detail/main').open(control.tag);
        }
    }


});
