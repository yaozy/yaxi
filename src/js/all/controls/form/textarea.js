yaxi.TextArea = yaxi.TextBox.extend(function () {


    
    // 是否禁用
    this.$('disabled', false);



}, function TextArea() {


    yaxi.Control.apply(this, arguments);


}).register('TextArea');
