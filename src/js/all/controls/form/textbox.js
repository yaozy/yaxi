yaxi.TextBox = yaxi.Control.extend(function () {




    this.$property('value', '');


    this.$property('text', {

        get: function () {

            var format = this.__format;
            return format ? format(this.value) : this.value;
        }
    });

    
    this.$property('placeholder', '');


    this.$property('maxlength', -1);


    this.$property('pattern', '');


    this.$property('format', null, {
    
        change: false,

        convert: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    });



    this.$property('selectionStart', 0, {

        alias: 'selection-start'
    });


    
    this.$property('selectionEnd', 0, {

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
