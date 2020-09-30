const yaxi = require('../../yaxi/js/yaxi');
const template = require('./receipt-edit.html');



module.exports = yaxi.Dialog.extend(function (Class, base) {
  


    var model;



    this.init = function (options) {

        this.loadTemplate(template, {}, model = options);
    }



    this.handleType = function (event) {

        model.type = event.target.tag;
    }


    this.handleOK = function () {

        if (check(this, 'name', '发票抬头') &&
            (model.type !== 1 || check(this, 'taxid', '税务识别号') && checkTaxId(this)) &&
            (model.type !== 2 || check(this, 'bank', '开户银行')) &&
            (model.type !== 2 || check(this, 'account', '银行帐号')) &&
            check(this, 'tel', '电话') &&
            check(this, 'address', '地址') &&
            check(this, 'email', '电子发票接收邮箱'))
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


    function checkTaxId(control) {

        var text = model.taxid;
        var length = text.length;

        if (length !== 15 && length !== 18 && length !== 20)
        {
            control.find('>>@error').text = '税务识别号只能是15/18/20位!';
        }
        else
        {
            return true;
        }
    }


});
