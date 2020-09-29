yaxi.Component.renderer(function (base) {



    this.render = function (control) {

        var shadowRoot = control.__shadowRoot;

        // 标记已渲染, 否则无法更新patch
        control.$view = true;
        control.__dirty = false;

        if (control.__changes)
        {
            control.$combineChanges();
            control.__changes = null;
        }

        if (!shadowRoot.$view)
        {
            // 以当前控件为模板创建dom以免污染模板的class
            shadowRoot.$view = this.createView(control);
        }

        // 渲染shadowRoot
        return shadowRoot.$renderer.render(shadowRoot);
    }

    
    this.patch = function (control, view) {

        var shadowRoot = control.__shadowRoot;

        control.__dirty = false;

        if (control.__changes)
        {
            control.$combineChanges();
            control.__changes = null;
        }

        // 渲染shadowRoot
        shadowRoot.$renderer.patch(shadowRoot, shadowRoot.$view);
    }



});
