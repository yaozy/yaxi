yaxi.Radio.renderer(function (base) {



    yaxi.template(this, '<div class="@class">'
            + '<div class="yx-icon icon-common-unchecked"></div>'
            + '<div class="yx-radio-content"></div>'
        + '</div>');



    this.checked = function (control, view, value) {

        view.firstChild.className = 'yx-icon icon-common-' + (value ? 'checked' : 'unchecked');
    }
    
    
    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }




});
