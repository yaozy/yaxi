yaxi.CheckBox = yaxi.Control.extend(function (Class, base) {




    this.$('name', '');
    

    this.$('text', '');
    

    this.$('checked', false);


    this.__set_checked = function (value) {

        this.$push(value);
        this.trigger('change');
    }


    this.$('color', '');


    // 是否禁用
    this.$('disabled', false);

    

    this.__on_tap = function () {

        if (this.trigger('changing') !== false)
        {
            this.checked = !this.value;
        }
    }


    
}, function CheckBox() {

    yaxi.Control.apply(this, arguments);

}).register('CheckBox');
