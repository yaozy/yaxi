yaxi.TextBox = yaxi.Control.extend(function () {




    this.$property('value', '');



    this.$property('text', {

        get: function () {

            return (any = this.__format) ? any(this.value) : this.value;
        },
        set: function (value) {

            this.value = value;
        }
    });

    
    this.$property('placeholder', '');


    this.$property('align', 'left');


    this.$property('maxlength', 0);


    this.$property('pattern', '');


    this.$property('format', null, {
    
        change: false,

        convert: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    });


}, function TextBox() {

    yaxi.Control.apply(this, arguments);
    
}).register('TextBox');