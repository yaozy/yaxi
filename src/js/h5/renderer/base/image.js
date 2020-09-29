yaxi.Image.renderer(function (base) {



    this.className = 'yx-control yx-image';
    


    this.template('<image class="@class"></image>');



    this.src = function (control, view, value) {

        view.src = value;
    }



});
