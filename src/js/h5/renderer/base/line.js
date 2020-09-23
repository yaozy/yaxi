yaxi.Line.renderer(function (renderer, base) {


    var color = yaxi.color;


    renderer.size = function (view, value) {

        view.style.width = value;
    }


    renderer.color = function (view, value) {

        view.style.backgroundColor = color[value] || value;
    }


});



yaxi.Vline.renderer(function (renderer, base) {


    var color = yaxi.color;


    renderer.size = function (view, value) {

        view.style.height = value;
    }


    renderer.color = function (view, value) {

        view.style.backgroundColor = color[value] || value;
    }


});


