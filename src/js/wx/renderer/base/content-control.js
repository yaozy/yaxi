yaxi.ContentControl.renderer(function (renderer, base) {

    

    this.render = function () {

        var view = base.render.call(this);
        var content = this.__init_content() || this.__no_content;

        view.c = this.__render_content(content);

        return view;
    }
    
    

    this.__render_content = function (content) {

        if (typeof content === 'string')
        {
            return [{
                t: 'Text',
                u: this.uuid,
                text: content
            }];
        }

        return this.renderChildren(content);
    }


    
    renderer.content = function (view, prefix, value) {

        view[prefix + 'c'] = this.__render_content(this.__init_content() || '');
    }



});
