yaxi.Radio = yaxi.Control.extend(function (Class, base) {




    Class.allowParent = function (parent) {

        return parent instanceof yaxi.RadioGroup;
    }



    this.$('name', '');


    this.$('text', '');


    this.$('checked', false);


    this.$('color', '');


    // 是否禁用
    this.$('disabled', false);



    this.__set_checked = function (value) {

        this.$push(value);
        this.trigger('change');
    }



}, function Radio() {


    yaxi.Control.apply(this, arguments);


}).register('Radio');
