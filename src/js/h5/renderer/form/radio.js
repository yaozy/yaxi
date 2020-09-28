yaxi.Radio.renderer(function (base) {



    yaxi.template(this, '<div class="$class">'
            + '<div class="yx-radio-icon iconfont icon-common-unchecked"></div>'
            + '<div class="yx-radio-content"></div>'
        + '</div>');



    this.checked = function (control, view, value) {

        view.firstChild.className = 'yx-radio-icon iconfont icon-common-' + (value ? 'checked' : 'unchecked');
    }
    
    
    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }




});
