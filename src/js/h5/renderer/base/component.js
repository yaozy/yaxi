yaxi.Component.renderer(function (base) {



    this.render = function (control) {

        var shadowRoot = control.__shadowRoot;

        control.__dirty = false;

        if (control.__changes)
        {
            control.$combineChanges();
            control.__changes = null;
        }

        // 渲染shadowRoot, 并把shadowRoot的$view作为当前控件的$view
        return control.$view = shadowRoot.$renderer.render(shadowRoot, control.uuid);
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
        shadowRoot.$renderer.patch(shadowRoot, view);
    }



});
