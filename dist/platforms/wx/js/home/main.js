const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');


module.exports = yaxi.Box.extend(function (Class, base) {


    this.init = function () {

        this.load(template(this));
    }


    this.openTest = function () {

        require('../test/main').open();
    }


});
