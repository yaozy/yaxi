yaxi.Line = yaxi.Control.extend(function (Class, base) {



    this.$property('size', '5rem');


    this.$property('color', 'text-level1');



}, function Line() {

    yaxi.Control.apply(this, arguments);

}).register('Line');




yaxi.Vline = yaxi.Control.extend(function (Class, base) {



    this.$property('size', '5rem');


    this.$property('color', 'text-level1');



}, function Vline() {

    yaxi.Control.apply(this, arguments);

}).register('Vline');
