yaxi.ContentControl.renderer(function (base) {

    

    this.render = function (control) {

        var view = base.render.call(this, control);
        var content = control.__init_content() || control.__no_content || '';

        this.renderContent(control, view, '', content);

        return view;
    }
    
    

    this.renderContent = function (control, view, prefix, content) {

        if (typeof content === 'string')
        {
            view[prefix + 'c'] = [{
                t: 'Text',
                u: control.uuid,
                text: content
            }];
        }
        else
        {
            this.renderChildren(view, prefix, content);
        }
    }


    
    this.content = function (control, view, prefix, value) {

        this.renderContent(control, view, prefix, control.__init_content() || '');
    }



});
