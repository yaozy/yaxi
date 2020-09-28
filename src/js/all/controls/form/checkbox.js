yaxi.CheckBox = yaxi.Control.extend(function (Class, base) {




    this.property('name', '');
    

    this.property('text', '');
    

    this.property('checked', false);

    
    this.property('color', '');




    this.__set_checked = function (value) {

        this.$push(value);
        this.trigger('change');
    }



    this.__on_tap = function () {

        if (this.trigger('changing') !== false)
        {
            this.checked = !this.value;
        }
    }


    
}, function CheckBox() {

    yaxi.Control.apply(this, arguments);

}).register('CheckBox');
