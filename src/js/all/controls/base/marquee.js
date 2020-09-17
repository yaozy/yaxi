yaxi.Marquee = yaxi.Control.extend(function (Class, base) {


    this.$property('text', '');


}, function Marquee() {

    yaxi.Control.apply(this, arguments);

}).register('Marquee');
