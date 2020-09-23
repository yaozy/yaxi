const yaxi = require('../../yaxi/js/yaxi');
const template = require('./address.html');



module.exports = yaxi.Page.extend(function (Class, base) {
  


    this.init = function (model, callback) {

        this.callback = callback;
        this.load(template(this, this.model = model));
    }



    this.handleOK = function () {

        this.callback(this.model);
        this.callback = this.model = null;
    }



    Class.open = function (model, callback) {

        new this(model, callback);
    }


});
