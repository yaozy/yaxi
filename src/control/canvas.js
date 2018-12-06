yaxi.Canvas = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<canvas class="yx-control"></canvas>');



    Class.ctor = function (data) {

        base.constructor.ctor.call(this, data);

        this.on('touchstart', touchstart.bind(this));
        this.on('touchmove', touchmove.bind(this));
    }

    

    this.$property('width', 300);


    this.$property('height', 300);



    function touchstart(event) {

        debugger
    }


    function touchmove(event) {

        debugger
    }



});
