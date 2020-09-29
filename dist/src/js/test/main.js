const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');


module.exports = yaxi.Page.extend(function (Class, base) {


    this.init = function () {

        this.loadTemplate(template);
    }


    this.handleTap = function (event) {

        require(event.target.tag).open();
    }


});
