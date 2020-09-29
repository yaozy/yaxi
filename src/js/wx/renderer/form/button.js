yaxi.Button.renderer(function (base) {

    

    function renderShadows(control, view, prefix) {

        var shadows = control.__shadows || '';

        if (typeof shadows === 'string')
        {
            view[prefix + 'c'] = [{
                t: 'Text',
                u: control.uuid,
                text: shadows
            }];
        }
        else
        {
            this.renderChildren(view, prefix, shadows)
        }
    }



    this.render = function (control) {

        var view = base.render.call(this, control);

        renderShadows.call(this, control, view, '');

        return view;
    }
    
    
    this.text = function (control, view, prefix) {

        renderShadows.call(this, control, view, prefix);
    }



});
