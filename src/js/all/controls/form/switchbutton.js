yaxi.SwitchButton = yaxi.Control.extend(function (Class, base) {



    this.property('name', '');
    

    this.property('checked', false);
    


}, function SwitchButton() {


    yaxi.Control.apply(this, arguments);


}).register('SwitchButton');
