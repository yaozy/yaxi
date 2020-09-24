yaxi.FloatLayer = yaxi.Box.extend(function (Class, base) {


    this.close = function () {

        this.remove();
        this.trigger('closed');
    }



    Class.open = function () {

        
    }



}, function FloatLayer() {

    yaxi.Box.apply(this, arguments);

}).register('FloatLayer');
