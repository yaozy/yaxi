yaxi.TabItem = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-tabitem"><span></span></span>');


    
    this.$property('text', '');


    
    this.renderer.text = function (dom, value) {

        dom.firstChild.textContent = value;
    }



}).register('TabItem');
