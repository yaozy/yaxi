yaxi.Button.renderer(function (base) {

    

    function rebuildUUID(controls, uuid) {

        var control;

        for (var i = controls.length; i--;)
        {
            if (control = controls[i])
            {
                control.u = uuid;
                control.c && rebuildUUID(control.c, uuid);
            }
        }
    }



    this.render = function (control) {

        var view = base.render.call(this, control);

        renderContent.call(this, control, view, '');

        return view;
    }
    
    

    function renderContent(control, view, prefix) {

        var content = control.__content || '';
        var controls;

        if (typeof content === 'string')
        {
            view[prefix + 'c'] = [{
                t: 'Text',
                u: control.uuid,
                text: content
            }];
        }
        else if (controls = this.renderChildren(view, prefix, content))
        {
            // 把子项的uuid编成和父节点一样来统一事件调用
            rebuildUUID(controls, control.uuid);
        }
    }


    
    this.text = function (control, view, prefix) {

        renderContent.call(this, control, view, prefix);
    }



});
