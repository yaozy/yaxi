yaxi.Image.renderer(function (base) {



    yaxi.template(this, '<image class="$class"></image>');



    this.src = function (control, view, value) {

        view.src = value;
    }



});
