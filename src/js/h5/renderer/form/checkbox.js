yaxi.CheckBox.renderer(function (base) {



    this.className = 'yx-control yx-checkbox';
    


    this.template('<div class="@class">'
            + '<div class="yx-icon icon-common-checkbox-unchecked"></div>'
            + '<div class="yx-checkbox-content"></div>'
        + '</div>');



    this.checked = function (control, view, value) {

        view.firstChild.className = 'yx-icon icon-common-checkbox-' + (value ? 'checked' : 'unchecked');
    }
    
    
    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }


});
