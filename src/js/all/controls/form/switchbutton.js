yaxi.SwitchButton = yaxi.Control.extend(function (Class, base) {



    this.$('name', '');
    

    this.$('checked', false);
    

    // 是否禁用
    this.$('disabled', false);



}, function SwitchButton() {


    yaxi.Control.apply(this, arguments);


}).register('SwitchButton');
