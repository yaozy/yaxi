yaxi.Control.extend('Radio', function (Class, base) {




    Class.allowParent = function (parent) {

        return parent instanceof yaxi.RadioGroup;
    }



    this.$('text', '');


    this.$('checked', false);


    this.$('color', '');


    // 是否禁用
    this.$('disabled', false);



    this.__set_checked = function (value) {

        this.$push(value);
        this.trigger('change', value);
    }



}, function Radio() {


    yaxi.Control.apply(this, arguments);


});
