yaxi.RadioButton = yaxi.Control.extend(function (Class, base) {



    this.$property('text', '');


    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-radio-checked', {

        alias: 'checked-icon'
    });


    this.$property('uncheckedIcon', 'icon-yaxi-radio-unchecked', {

        alias: 'unchecked-icon'
    });


    // 互斥容器级别
    this.$property('host', 1);


}, function RadioButton() {

    yaxi.Control.apply(this, arguments);

}).register('RadioButton');
