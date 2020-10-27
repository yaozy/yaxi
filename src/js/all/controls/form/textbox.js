yaxi.Control.extend('TextBox', function () {



    var pipe = yaxi.pipe.compile;

    


    this.$('name', '');


    this.$('value', '');

    
    this.$('placeholder', '');


    this.$('maxlength', -1);


    this.$('pattern', '');


    this.$('format', null, false);



    this.__set_format = function (value) {

        this.__format = typeof value === 'function' ? value : pipe(value);
    }



    this.$('selectionStart', 0, {

        alias: 'selection-start'
    });


    
    this.$('selectionEnd', 0, {

        alias: 'selection-end'
    });



    // 是否禁用
    this.$('disabled', false);

    

    this.focus = function () {

        this.$renderer.focus(this);
    }



    this.__on_change = function (value) {

        if (!this.$push(value))
        {
            this.value = value;
        }
    }




}, function TextBox() {


    yaxi.Control.apply(this, arguments);
    

});
