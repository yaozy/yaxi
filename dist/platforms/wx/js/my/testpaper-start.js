const yaxi = require('../../yaxi/js/yaxi');
const template = require('./testpaper-start.html');



module.exports = yaxi.Page.extend(function (Class, base) {



    this.init = function (model) {

        this.loadTemplate(template, {}, model);
    }



    this.handleStart = function (event) {
        
    }


});
