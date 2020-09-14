const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');


module.exports = yaxi.Box.extend(function (Class, base) {


    this.init = function () {

        this.loadTemplate(template);
    }


    this.openTest = function () {

        require('../test/main').open();
    }


    this.handleSearch = function () {

        require('./search').open();
    }


});
