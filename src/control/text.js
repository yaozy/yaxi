yaxi.Text = yaxi.Control.extend(function () {



    yaxi.template(this, '<span class="yx-control yx-text"></span>');



    this.$property('text', '');


    this.$property('security', '');


    this.$property('format', {
    
        defaultValue: null,
        converter: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    }, false);



    this.renderer.text = function (dom, value) {

        var format;

        if (!this.__security)
        {
            dom.textContent = (format = this.__format) ? format(value) : value;
        }
    }


    this.renderer.security = function (dom, value) {

        var format;

        if (this.__security = value)
        {
            dom.textContent = value;
        }
        else
        {
            dom.textContent = (format = this.__format) ? format(this.text) : this.text;
        }
    }



}).register('Text');
