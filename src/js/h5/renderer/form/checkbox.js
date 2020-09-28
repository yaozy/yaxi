yaxi.CheckBox.renderer(function (base) {



    yaxi.template(this, '<div class="$class">'
            + '<div class="yx-checkbox-icon iconfont icon-common-unchecked"></div>'
            + '<div class="yx-checkbox-content"></div>'
        + '</div>');



    this.checked = function (control, view, value) {

        view.firstChild.className = 'yx-checkbox-icon iconfont icon-common-' + (value ? 'checked' : 'unchecked');
    }
    
    
    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }


});
