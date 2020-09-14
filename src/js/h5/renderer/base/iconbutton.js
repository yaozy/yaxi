yaxi.IconButton.mixin(function (mixin, base) {



    yaxi.template(this, '<div class="$class">'
            + '<div></div>'
            + '<div class="yx-iconbutton-content"></div>'
        + '</div>');


    
    mixin.icon = function (view, value) {

        view.firstChild.className = 'yx-iconbutton-icon iconfont' + (value ? ' icon-' + value : '');
    }


    mixin.size = function (view, value) {

        var style = view.firstChild.style;
        style.width = style.height = value;
    }


    this.__render_content = function (view, content) {

        base.__render_content.call(this, view.lastChild, content);
    }


});
