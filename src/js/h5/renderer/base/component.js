yaxi.Component.renderer(function (base) {


    
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
