const yaxi = require('../../yaxi/js/yaxi');
const template = require('./address-edit.html');



module.exports = yaxi.Dialog.extend(function (Class, base) {
  


    var model;



    this.init = function (options) {

        this.load(template(this, {}, model = options));
    }


    this.handleMan = function () {

        model.gendle = 1;
    }


    this.handleWoman = function () {

        model.gendle = 0;
    }



    this.handleOK = function () {

        if (check(this, 'name', '姓名') &&
            check(this, 'tel', '电话') &&
            check(this, 'address', '地址') &&
            check(this, 'house', '楼宇门牌'))
        {
            this.close('OK', model);
        }
    }


    function check(control, name, text) {

        if (!model[name].trim())
        {
            control.find('>>@error').text = '必须输入' + text + '!';
        }
        else
        {
            return true;
        }
    }


});
