yaxi.TextBox = yaxi.Control.extend(function () {



    var pipe = yaxi.pipe.compile;

    


    this.property('name', '');


    this.property('value', '');

    
    this.property('placeholder', '');


    this.property('maxlength', -1);


    this.property('pattern', '');


    this.property('format', null, false);



    this.__set_format = function (value) {

        this.__format = typeof value === 'function' ? value : pipe(value);
    }



    this.property('selectionStart', 0, {

        alias: 'selection-start'
    });


    
    this.property('selectionEnd', 0, {

        alias: 'selection-end'
    });




    this.focus = function () {

        this.$renderer.focus(this);
    }



    this.__on_change = function (value) {

        this.$push(value);
    }




}, function TextBox() {

    yaxi.Control.apply(this, arguments);
    
}).register('TextBox');
