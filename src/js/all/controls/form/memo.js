yaxi.Memo = yaxi.Control.extend(function () {


    
    this.$('name', '');
    

    this.$('value', '');

    
    this.$('placeholder', '');


    this.$('text', '');


    // 是否禁用
    this.$('disabled', false);


    
}, function Memo() {

    yaxi.Control.apply(this, arguments);

}).register('Memo');
