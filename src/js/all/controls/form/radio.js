yaxi.Radio = yaxi.Control.extend(function (Class, base) {




    Class.allowParent = function (parent) {

        return parent instanceof yaxi.RadioGroup;
    }



    this.property('name', '');


    this.property('text', '');


    this.property('checked', false);


    this.property('color', '');



    this.__set_checked = function (value) {

        this.$push(value);
        this.trigger('change');
    }



}, function Radio() {


    yaxi.Control.apply(this, arguments);


}).register('Radio');
