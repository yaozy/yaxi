yaxi.Tel = yaxi.Box.extend(function () {



    yaxi.template(this, '<div class="$class" rel="nofollow" target="_blank"><a rel="nofollow" target="_blank"></a></div>');



    // 电话号码
    this.$property('value', '');

    

    this.$mixin.value = function (view, value) {

        view.firstChild.setAttribute('href', value ? 'tel:' + value : '');
    }


    
}).register('Tel');
