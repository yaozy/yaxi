yaxi.Control.extend('CheckBox', function (Class, base) {




    this.$('name', '');
    

    this.$('text', '');
    

    this.$('checked', false);


    this.__set_checked = function (value) {

        this.$push(value);
        this.trigger('change', value);
    }


    this.$('color', '');


    // 是否禁用
    this.$('disabled', false);

    

    this.__on_tap = function () {

        var checked = !this.checked;

        if (this.trigger('changing', checked) !== false)
        {
            this.checked = checked;
        }
    }


    
}, function CheckBox() {


    yaxi.Control.apply(this, arguments);


});
