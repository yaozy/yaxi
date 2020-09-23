yaxi.Image.renderer(function (renderer, base) {



    yaxi.template(this, '<image class="$class"></image>');



    renderer.src = function (view, value) {

        view.src = value;
    }



});
