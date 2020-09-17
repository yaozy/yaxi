yaxi.Line = yaxi.Control.extend(function (Class, base) {



    this.$property('size', '5rem');


    this.$property('color', 'font-level1-color');



}, function Line() {

    yaxi.Control.apply(this, arguments);

}).register('Line');




yaxi.VerticalLine = yaxi.Control.extend(function (Class, base) {



    this.$property('size', '5rem');


    this.$property('color', 'font-level1-color');



}, function VerticalLine() {

    yaxi.Control.apply(this, arguments);

}).register('VerticalLine');
