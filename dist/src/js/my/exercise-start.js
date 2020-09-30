const yaxi = require('../../yaxi/js/yaxi');
const template = require('./exercise-start.html');



module.exports = yaxi.Page.extend(function (Class, base) {



    this.init = function (data) {

        this.loadTemplate(template, data);
    }



    this.handleStart = function (event) {
        
    }


});
