const yaxi = require('../../yaxi/js/yaxi');
const template = require('./exercise-start.html');



module.exports = yaxi.Page.extend(function (Class, base) {



    this.init = function (model) {

        this.loadTemplate(template, {}, model);
    }



    this.handleStart = function (event) {
        
    }


});
