const yaxi = require('../../yaxi/js/yaxi');
const template = require('./address-edit.html');



module.exports = yaxi.FloatLayer.extend(function (Class, base) {
  


    this.init = function (model) {

        this.load(template(this, {}, this.model = model));
    }



    this.handleClose = function () {

        this.model = null;
        this.remove();

        return false;
    }


    this.handleOK = function () {

        var parent = this.$parent;
        var model = this.model;

        this.model = null;
        this.remove();

        parent.afterEdit(model);
    }



    Class.open = function (parent, model) {

        parent.children.push(new this(model));
    }


});
