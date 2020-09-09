yaxi.CheckBox = yaxi.Control.extend(function (Class, base) {


    this.$property('text', '');
    

    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-checkbox-checked', true, 'checked-icon');


    this.$property('uncheckedIcon', 'icon-yaxi-checkbox-unchecked', true, 'unchecked-icon');

    
}, function CheckBox() {

    yaxi.Control.apply(this, arguments);

}).register('CheckBox');
