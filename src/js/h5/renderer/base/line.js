yaxi.Line.renderer(function (base) {


    var color = yaxi.color;


    this.size = function (control, view, value) {

        view.style.width = value;
    }


    this.color = function (control, view, value) {

        view.style.backgroundColor = color[value] || value;
    }


});



yaxi.Vline.renderer(function (base) {


    var color = yaxi.color;


    this.size = function (control, view, value) {

        view.style.height = value;
    }


    this.color = function (control, view, value) {

        view.style.backgroundColor = color[value] || value;
    }


});


