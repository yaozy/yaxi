yaxi.ScrollBox.renderer(function (base, thisControl) {




    this.className = 'yx-control yx-box yx-scrollbox';




    thisControl.scrollTo = function (top) {

        var view;

        if (view = this.$view)
        {
            view.scrollTop = top | 0;
        }
    }


    thisControl.scrollIntoView = function (childControl) {

        var view, dom;

        if ((view = this.$view) && (dom = childControl && childControl.$view))
        {
            view.scrollIntoView(dom);
        }
    }


});
