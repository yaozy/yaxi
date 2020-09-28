yaxi.Text = yaxi.Control.extend(function (Class, base) {



    var pipe = yaxi.pipe.compile;
    


    this.property('text', '');


    this.property('security', '');


    this.property('format', null, false);


    this.__set_format = function (value) {

        this.__format = typeof value === 'function' ? value : pipe(value);
    }



    this.__load_children = function (value) {

        this.text = value;
    }



}, function Text() {

    yaxi.Control.apply(this, arguments);

}).register('Text');
