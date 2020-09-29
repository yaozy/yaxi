yaxi.Line.renderer(function (base) {


    var color = yaxi.color;


    
    this.className = 'yx-control yx-line';
    


    this.size = function (control, view, value) {

        view.style.width = value;
    }


    this.color = function (control, view, value) {

        view.style.backgroundColor = color[value] || value;
    }


});



yaxi.Vline.renderer(function (base) {


    var color = yaxi.color;



    this.className = 'yx-control yx-vline';
    


    this.size = function (control, view, value) {

        view.style.height = value;
    }


    this.color = function (control, view, value) {

        view.style.backgroundColor = color[value] || value;
    }


});


