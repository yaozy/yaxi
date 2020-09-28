yaxi.ImageButton.renderer(function (base) {



    yaxi.template(this, '<div class="$class">'
            + '<div class="yx-imagebutton-image"></div>'
            + '<div class="yx-imagebutton-content"></div>'
        + '</div>');



    this.src = function (control, view, value) {

        view.firstChild.style.backgroundImage = value ? 'url(' + value + ')' : '';
    }


    this.size = function (control, view, value) {

        var style = view.firstChild.style;
        style.width = style.height = value;
    }


    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }


});
