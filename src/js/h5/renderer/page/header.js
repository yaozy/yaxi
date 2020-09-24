yaxi.Header.renderer(function (base) {



    yaxi.template(this, '<div class="$class">'
            + '<span class="yx-header-back iconfont icon-common-back" flag="back" style="display:none;"></span>'
            + '<span class="yx-header-hide"></span>'
            + '<span class="yx-header-host"></span>'
        + '</div>');



    this.renderContent = function (control, view, content) {

        base.renderContent.call(this, control, view.lastChild, content);
        view.firstChild.style.display = yaxi.currentPages.length > 1 ? '' : 'none';
    }



    this.icon = function (control, view, value) {

        view = view.firstChild.nextSibling;
        view.className = value ? 'yx-header-icon iconfont ' + value : 'yx-header-hidden';
    }


});
