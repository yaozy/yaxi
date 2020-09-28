yaxi.Line = yaxi.Control.extend(function (Class, base) {



    this.property('size', '5rem');


    this.property('color', 'text-standard');



}, function Line() {

    yaxi.Control.apply(this, arguments);

}).register('Line');




yaxi.Vline = yaxi.Control.extend(function (Class, base) {



    this.property('size', '5rem');


    this.property('color', 'text-standard');



}, function Vline() {

    yaxi.Control.apply(this, arguments);

}).register('Vline');
