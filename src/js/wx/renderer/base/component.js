yaxi.Component.renderer(function (base) {


    // 全局渲染
    this.render = function (control) {

        var shadowRoot = control.__shadowRoot;

        control.__dirty = false;

        if (control.__changes)
        {
            control.$combineChanges();
            control.__changes = null;
        }

        // 渲染shadowRoot
        return shadowRoot.$renderer.render(shadowRoot);
    }
    

    
    this.patch = function (control, view, prefix) {

        var shadowRoot = control.__shadowRoot;

        control.__dirty = false;

        if (control.__changes)
        {
            control.$combineChanges();
            control.__changes = null;
        }

        // 渲染shadowRoot
        shadowRoot.$renderer.patch(shadowRoot, view, prefix);
    }



});
