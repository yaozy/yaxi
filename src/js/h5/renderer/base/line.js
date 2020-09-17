yaxi.Line.mixin(function (mixin, base) {


    var color = yaxi.color;


    mixin.size = function (view, value) {

        view.style.width = value;
    }


    mixin.color = function (view, value) {

        view.style.backgroundColor = color[value] || value;
    }


});



yaxi.VerticalLine.mixin(function (mixin, base) {


    var color = yaxi.color;


    mixin.size = function (view, value) {

        view.style.height = value;
    }


    mixin.color = function (view, value) {

        view.style.backgroundColor = color[value] || value;
    }


});


