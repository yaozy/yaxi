yaxi.ImageButton.renderer(function (renderer, base) {



    yaxi.template(this, '<div class="$class">'
            + '<div class="yx-imagebutton-image"></div>'
            + '<div class="yx-imagebutton-content"></div>'
        + '</div>');



    renderer.src = function (view, value) {

        view.firstChild.style.backgroundImage = value ? 'url(' + value + ')' : '';
    }


    renderer.size = function (view, value) {

        var style = view.firstChild.style;
        style.width = style.height = value;
    }


    this.__render_content = function (view, content) {

        base.__render_content.call(this, view.lastChild, content);
    }


});
