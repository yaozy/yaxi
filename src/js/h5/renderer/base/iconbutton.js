yaxi.IconButton.renderer(function (base) {



    yaxi.template(this, '<div class="$class">'
            + '<div></div>'
            + '<div class="yx-iconbutton-content"></div>'
        + '</div>');


    
    this.icon = function (control, view, value) {

        view.firstChild.className = 'yx-iconbutton-icon iconfont' + (value ? ' icon-' + value : '');
    }


    this.size = function (control, view, value) {

        view.firstChild.style.fontSize = value > 0 ? value + 'rem' : value;
    }


    this.renderContent = function (view, content) {

        base.renderContent.call(this, view.lastChild, content);
    }


});
