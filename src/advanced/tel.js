yaxi.Tel = yaxi.Panel.extend(function () {



    yaxi.template(this, '<div class="yx-control yx-panel yx-tel" rel="nofollow" target="_blank"><a rel="nofollow" target="_blank"></a></div>');



    // 电话号码
    this.$property('value', '');

    

    this.renderer.value = function (dom, value) {

        dom.firstChild.setAttribute('href', value ? 'tel:' + value : '');
    }


    
}).register('Tel');
