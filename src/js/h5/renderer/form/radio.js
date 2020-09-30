yaxi.Radio.renderer(function (base) {



    this.className = 'yx-control yx-radio';
    


    this.template('<div class="@class">'
            + '<div class="yx-icon icon-common-radio-unchecked"></div>'
            + '<div class="yx-radio-content"></div>'
        + '</div>');



    this.checked = function (control, view, value) {

        view.firstChild.className = 'yx-icon icon-common-radio-' + (value ? 'checked' : 'unchecked');
    }
    
    
    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }




});
