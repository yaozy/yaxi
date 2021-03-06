yaxi.IconButton.renderer(function (base) {



    this.className = 'yx-control yx-iconbutton';
    


    this.template('<div class="@class">'
            + '<div></div>'
            + '<div class="yx-iconbutton-content"></div>'
        + '</div>');


    
    this.icon = function (control, view, value) {

        view.firstChild.className = 'yx-iconbutton-icon iconfont' + (value ? ' icon-' + value : '');
    }


    this.size = function (control, view, value) {

        view.firstChild.style.fontSize = value > 0 ? value + 'rem' : value;
    }


    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }


});
