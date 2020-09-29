yaxi.Control.extend('Text', function (Class, base) {



    var pipe = yaxi.pipe.compile;
    


    this.$('text', '');


    this.$('security', '');


    this.$('format', null, false);


    this.__set_format = function (value) {

        this.__format = typeof value === 'function' ? value : pipe(value);
    }



    this.__load_children = function (value) {

        this.text = value;
    }



}, function Text() {


    yaxi.Control.apply(this, arguments);


});
