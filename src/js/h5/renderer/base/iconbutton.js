yaxi.IconButton.renderer(function (renderer, base) {



    yaxi.template(this, '<div class="$class">'
            + '<div></div>'
            + '<div class="yx-iconbutton-content"></div>'
        + '</div>');


    
    renderer.icon = function (view, value) {

        view.firstChild.className = 'yx-iconbutton-icon iconfont' + (value ? ' icon-' + value : '');
    }


    renderer.size = function (view, value) {

        view.firstChild.style.fontSize = value > 0 ? value + 'rem' : value;
    }


    this.__render_content = function (view, content) {

        base.__render_content.call(this, view.lastChild, content);
    }


});
