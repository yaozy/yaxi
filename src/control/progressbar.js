yaxi.ProgressBar = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<div class="yx-control yx-progressbar"><div></div></div>');



    this.$property('value', 0);



    this.renderer.value = function (dom, value) {

        dom.firstChild.style.width = value + '%';
    }



}).register('ProgressBar');
