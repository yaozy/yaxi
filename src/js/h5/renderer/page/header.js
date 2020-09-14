yaxi.Header.mixin(function (mixin, base) {



    yaxi.template(this, '<div class="$class">'
            + '<span class="yx-header-back iconfont icon-common-back" flag="back" style="display:none;"></span>'
            + '<span class="yx-header-hide"></span>'
            + '<span class="yx-header-host"></span>'
        + '</div>');



    this.__render_content = function (view, content) {

        base.__render_content.call(this, view.lastChild, content);
        view.firstChild.style.display = yaxi.currentPages.length > 1 ? '' : 'none';
    }



    mixin.icon = function (view, value) {

        view = view.firstChild.nextSibling;
        view.className = value ? 'yx-header-icon iconfont ' + value : 'yx-header-hidden';
    }


});
